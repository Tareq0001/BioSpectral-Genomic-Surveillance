/**
 * ============================================================================
 * BIOSPECTRAL GENOMIC SURVEILLANCE - GENOMIC SIGNAL PROCESSING (GSP) ENGINE
 * Voss Representation, Cooley-Tukey Radix-2 FFT & Period-3 Exon Peak Detection
 * ============================================================================
 */

(function (window) {
  'use strict';

  class GenomicSignalProcessor {
    constructor() {
      this.currentSequence = '';
      this.vossIndicators = { A: [], C: [], G: [], T: [] };
      this.powerSpectrum = [];
    }

    /**
     * Map DNA string to binary Voss indicators
     */
    mapVossIndicators(dnaString) {
      const cleanSeq = dnaString.toUpperCase().replace(/[^ACGT]/g, '');
      const n = cleanSeq.length;

      // Find nearest power of 2 for FFT
      let pow2 = 1;
      while (pow2 * 2 <= n && pow2 < 2048) pow2 *= 2;

      this.currentSequence = cleanSeq.slice(0, pow2);
      const len = this.currentSequence.length;

      this.vossIndicators = {
        A: new Float64Array(len),
        C: new Float64Array(len),
        G: new Float64Array(len),
        T: new Float64Array(len)
      };

      for (let i = 0; i < len; i++) {
        const char = this.currentSequence[i];
        if (char === 'A') this.vossIndicators.A[i] = 1.0;
        else if (char === 'C') this.vossIndicators.C[i] = 1.0;
        else if (char === 'G') this.vossIndicators.G[i] = 1.0;
        else if (char === 'T') this.vossIndicators.T[i] = 1.0;
      }

      return len;
    }

    /**
     * Cooley-Tukey Radix-2 Fast Fourier Transform
     */
    fft(realInput) {
      const n = realInput.length;
      if (n <= 1) return { re: [realInput[0] || 0], im: [0] };

      const re = new Float64Array(n);
      const im = new Float64Array(n);
      for (let i = 0; i < n; i++) re[i] = realInput[i];

      // Bit reversal permutation
      let j = 0;
      for (let i = 0; i < n - 1; i++) {
        if (i < j) {
          const tempR = re[i]; re[i] = re[j]; re[j] = tempR;
          const tempI = im[i]; im[i] = im[j]; im[j] = tempI;
        }
        let k = n >> 1;
        while (k <= j) {
          j -= k;
          k >>= 1;
        }
        j += k;
      }

      // Cooley-Tukey butterflies
      for (let len = 2; len <= n; len <<= 1) {
        const halfLen = len >> 1;
        const angle = -2 * Math.PI / len;
        const wStepR = Math.cos(angle);
        const wStepI = Math.sin(angle);

        for (let i = 0; i < n; i += len) {
          let wR = 1.0;
          let wI = 0.0;

          for (let k = 0; k < halfLen; k++) {
            const pos = i + k;
            const matchPos = pos + halfLen;

            const uR = re[pos];
            const uI = im[pos];
            const vR = re[matchPos] * wR - im[matchPos] * wI;
            const vI = re[matchPos] * wI + im[matchPos] * wR;

            re[pos] = uR + vR;
            im[pos] = uI + vI;
            re[matchPos] = uR - vR;
            im[matchPos] = uI - vI;

            const nextWR = wR * wStepR - wI * wStepI;
            wI = wR * wStepI + wI * wStepR;
            wR = nextWR;
          }
        }
      }

      return { re, im };
    }

    /**
     * Compute Total Genomic Power Spectrum Density: S[k] = sum |X_alpha[k]|^2
     */
    computeGenomicPSD(dnaString) {
      const len = this.mapVossIndicators(dnaString);
      if (len < 16) return null;

      const fftA = this.fft(this.vossIndicators.A);
      const fftC = this.fft(this.vossIndicators.C);
      const fftG = this.fft(this.vossIndicators.G);
      const fftT = this.fft(this.vossIndicators.T);

      const halfLen = len / 2;
      this.powerSpectrum = [];

      for (let k = 0; k < halfLen; k++) {
        const pA = fftA.re[k] * fftA.re[k] + fftA.im[k] * fftA.im[k];
        const pC = fftC.re[k] * fftC.re[k] + fftC.im[k] * fftC.im[k];
        const pG = fftG.re[k] * fftG.re[k] + fftG.im[k] * fftG.im[k];
        const pT = fftT.re[k] * fftT.re[k] + fftT.im[k] * fftT.im[k];

        const totalP = (pA + pC + pG + pT) / len;
        const normalizedFreq = k / len;

        this.powerSpectrum.push({
          k,
          freq: +normalizedFreq.toFixed(4),
          power: +totalP.toFixed(2)
        });
      }

      // Period-3 Peak Index (k = len / 3)
      const p3Index = Math.round(len / 3);
      const p3Power = this.powerSpectrum[p3Index] ? this.powerSpectrum[p3Index].power : 0;

      // Median background power
      const sortedPowers = this.powerSpectrum.map(p => p.power).sort((a, b) => a - b);
      const medianPower = sortedPowers[Math.floor(sortedPowers.length / 2)] || 1.0;
      const snrPeriod3 = +(p3Power / medianPower).toFixed(2);

      return {
        spectrum: this.powerSpectrum,
        sequenceLength: len,
        p3Index,
        p3Power,
        medianPower,
        snrPeriod3,
        isCodingExon: snrPeriod3 >= 3.8
      };
    }
  }

  window.GenomicSignalProcessor = GenomicSignalProcessor;
})(window);
