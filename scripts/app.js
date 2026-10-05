/**
 * ============================================================================
 * BIOSPECTRAL GENOMIC SURVEILLANCE - MAIN APPLICATION CONTROLLER
 * State Orchestrator, Genome Benchmark Loader & Spectral Execution
 * ============================================================================
 */

(function (window) {
  'use strict';

  class BioSurveillanceApp {
    constructor() {
      this.dsp = new window.GenomicSignalProcessor();
      this.pangenome = new window.PangenomeVariationGraph();
      this.activeView = 'view-psd';
      this.currentLang = 'en';

      this.benchmarks = {
        hbb: 'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGG',
        viral: 'ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAATTACCCCCTGCATACACTAATTCTTTCACACGTGGTGTTTATTACCCTGACAAAGTTTTCAGATCCTCAGTTTTACATTCAACTCAGGACTTGTTCTTACCTTTCTTTTCCAATGTTACTTGGTTCCATGCTATACATGTCTCTGGGACCAATGGTACTAAGAGGTTTGATAACCCTGTCCTACCATTTAATGATGGTGTTTATTTTGCTTCCACTGAGAAGTCTAACATAATAAGAGGCTGGATTTTTGGT',
        intron: 'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'
      };

      this.initDOM();
      this.initEngines();
      this.bindEvents();
      this.loadBenchmark('hbb');
    }

    initDOM() {
      this.canvasPSD = document.getElementById('canvas-psd');
      this.canvasPangenome = document.getElementById('canvas-pangenome');
      this.dnaTrackBox = document.getElementById('dna-sequence-ribbon');

      this.statBpCount = document.getElementById('stat-bp-count');
      this.statPeriod3Snr = document.getElementById('stat-period3-snr');
      this.statExonStatus = document.getElementById('stat-exon-status');
      this.statVariantCount = document.getElementById('stat-variant-count');

      this.navButtons = document.querySelectorAll('.nav-item-btn');
      this.views = document.querySelectorAll('.view-container');
      this.terminalBody = document.getElementById('terminal-logs-body');
      this.terminalInput = document.getElementById('terminal-cli-input');
    }

    initEngines() {
      if (this.terminalBody && this.terminalInput) {
        this.cli = new window.CyberBioCLI(this.terminalBody, this.terminalInput);
      }
    }

    bindEvents() {
      this.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const v = btn.getAttribute('data-view');
          this.switchView(v);
        });
      });

      const selectGenome = document.getElementById('benchmark-genome-select');
      if (selectGenome) {
        selectGenome.addEventListener('change', e => {
          this.loadBenchmark(e.target.value);
        });
      }

      const btnFft = document.getElementById('btn-run-fft');
      if (btnFft) {
        btnFft.addEventListener('click', () => this.runSpectralAnalysis());
      }

      const btnLang = document.getElementById('btn-lang-toggle');
      if (btnLang) {
        btnLang.addEventListener('click', () => {
          this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
          document.body.classList.toggle('lang-ar', this.currentLang === 'ar');
          btnLang.textContent = this.currentLang === 'ar' ? 'English' : 'عربي';
        });
      }

      const btnTerm = document.getElementById('btn-toggle-terminal');
      const drawer = document.getElementById('terminal-drawer');
      if (btnTerm && drawer) {
        btnTerm.addEventListener('click', () => drawer.classList.toggle('minimized'));
      }
    }

    switchView(viewId) {
      this.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
      });
      this.views.forEach(v => {
        v.classList.toggle('active', v.id === viewId);
      });
      this.activeView = viewId;

      if (viewId === 'view-psd') {
        this.runSpectralAnalysis();
      } else if (viewId === 'view-pangenome' && this.canvasPangenome) {
        window.CanvasBio.renderPangenomeGraph(this.canvasPangenome, this.pangenome);
      }
    }

    loadBenchmark(key) {
      const seq = this.benchmarks[key] || this.benchmarks.hbb;
      this.currentRawSeq = seq;
      this.renderDNARibbon(seq);
      this.runSpectralAnalysis();
    }

    renderDNARibbon(seq) {
      if (!this.dnaTrackBox) return;
      let html = '';
      const displayLen = Math.min(seq.length, 300);

      for (let i = 0; i < displayLen; i++) {
        const char = seq[i];
        let cls = 'base-a';
        if (char === 'T') cls = 'base-t';
        else if (char === 'C') cls = 'base-c';
        else if (char === 'G') cls = 'base-g';

        // Highlight sickle cell codon (position 17-20)
        if (i === 17 && char === 'A') {
          html += `<span class="base-mut ${cls}" title="rs334 Sickle Cell SNP Candidate">${char}</span>`;
        } else {
          html += `<span class="${cls}">${char}</span>`;
        }
      }
      this.dnaTrackBox.innerHTML = html;
    }

    runSpectralAnalysis() {
      if (!this.currentRawSeq) return;
      const psd = this.dsp.computeGenomicPSD(this.currentRawSeq);
      if (!psd) return;

      if (this.canvasPSD) {
        window.CanvasBio.renderPSD(this.canvasPSD, psd);
      }

      if (this.statBpCount) this.statBpCount.textContent = `${psd.sequenceLength} bp`;
      if (this.statPeriod3Snr) this.statPeriod3Snr.textContent = `${psd.snrPeriod3}x`;
      if (this.statExonStatus) {
        this.statExonStatus.textContent = psd.isCodingExon ? 'CODING EXON (HIGH)' : 'NON-CODING / INTRON';
        this.statExonStatus.style.color = psd.isCodingExon ? 'var(--base-c)' : 'var(--base-t)';
      }
      if (this.statVariantCount) this.statVariantCount.textContent = '2 Pathogenic';
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.App = new BioSurveillanceApp();
  });
})(window);
