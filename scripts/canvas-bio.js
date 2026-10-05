/**
 * ============================================================================
 * BIOSPECTRAL GENOMIC SURVEILLANCE - CANVAS VISUALIZATION SUITE
 * Genomic Power Spectral Density (PSD) Canvas & Pangenome Bubble Graph
 * ============================================================================
 */

(function (window) {
  'use strict';

  const CanvasBio = {
    setupDPI(canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || canvas.width || 600;
      const h = rect.height || canvas.height || 260;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      const ctx = canvas.getContext('2d');
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      return { ctx, w, h };
    },

    /**
     * 1. Genomic Power Spectral Density (PSD) with Period-3 Peak Pointer
     */
    renderPSD(canvas, psdResult) {
      const { ctx, w, h } = this.setupDPI(canvas);
      ctx.clearRect(0, 0, w, h);

      if (!psdResult || !psdResult.spectrum || psdResult.spectrum.length === 0) {
        ctx.fillStyle = '#5d7e6f';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('Execute Spectral FFT to plot Genomic Power Spectral Density...', 20, h / 2);
        return;
      }

      const padding = { top: 30, right: 30, bottom: 40, left: 55 };
      const plotW = w - padding.left - padding.right;
      const plotH = h - padding.top - padding.bottom;

      const spec = psdResult.spectrum;
      let maxPower = 0;
      spec.forEach(p => { if (p.power > maxPower) maxPower = p.power; });
      if (maxPower === 0) maxPower = 1;

      // Draw background cyber grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (plotH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + plotW, y);
        ctx.stroke();
      }

      // Draw Spectrum Line
      const stepX = plotW / (spec.length - 1);
      ctx.beginPath();
      spec.forEach((p, idx) => {
        const x = padding.left + idx * stepX;
        const y = padding.top + plotH - (p.power / maxPower) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Period-3 Frequency Laser Pointer (f = 0.333)
      const p3X = padding.left + psdResult.p3Index * stepX;
      ctx.beginPath();
      ctx.moveTo(p3X, padding.top);
      ctx.lineTo(p3X, padding.top + plotH);
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label at Period-3
      ctx.font = '700 10.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fb7185';
      ctx.fillText(`PERIOD-3 RESONANCE (f = 1/3) | SNR: ${psdResult.snrPeriod3}x`, Math.min(plotW - 120, p3X + 8), padding.top + 20);

      // Title & Labels
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('GENOMIC POWER SPECTRAL DENSITY (FFT VOSS INDICATORS)', padding.left, 20);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94b8a7';
      ctx.fillText('f = 0.0', padding.left, h - 12);
      ctx.fillText('f = 0.5 (Nyquist)', padding.left + plotW - 80, h - 12);
    },

    /**
     * 2. Pangenome Variation Bubble Graph Canvas
     */
    renderPangenomeGraph(canvas, graph) {
      const { ctx, w, h } = this.setupDPI(canvas);
      ctx.clearRect(0, 0, w, h);

      if (!graph || !graph.nodes) return;

      // Draw Links
      graph.links.forEach(l => {
        const u = graph.nodes.find(n => n.id === l.source);
        const v = graph.nodes.find(n => n.id === l.target);
        if (!u || !v) return;

        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);
        ctx.strokeStyle = l.haplotype === 'REF_WILDTYPE' ? 'rgba(0, 255, 136, 0.4)' : 'rgba(251, 113, 133, 0.5)';
        ctx.lineWidth = l.haplotype === 'REF_WILDTYPE' ? 2 : 2.5;
        ctx.stroke();
      });

      // Draw Nodes
      graph.nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);

        if (n.type === 'ref') {
          ctx.fillStyle = '#062d1d';
          ctx.strokeStyle = '#00ff88';
        } else {
          ctx.fillStyle = '#2d0e16';
          ctx.strokeStyle = '#fb7185';
        }

        ctx.lineWidth = 2.2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y - n.r - 8);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94b8a7';
        ctx.fillText(n.seq, n.x, n.y + n.r + 14);
      });
      ctx.textAlign = 'left';
    }
  };

  window.CanvasBio = CanvasBio;
})(window);
