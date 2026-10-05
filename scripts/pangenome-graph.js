/**
 * ============================================================================
 * BIOSPECTRAL GENOMIC SURVEILLANCE - PANGENOME DE BRUIJN VARIATION GRAPH
 * Sequence Bubble Detection, Structural Inversions & Variant Haplotype Paths
 * ============================================================================
 */

(function (window) {
  'use strict';

  class PangenomeVariationGraph {
    constructor() {
      this.nodes = [];
      this.links = [];
      this.buildDefaultVariantBubbles();
    }

    buildDefaultVariantBubbles() {
      // Backbone Reference Nodes (Emerald) vs Variant Bubble Nodes (Coral/Cyan)
      this.nodes = [
        { id: 'node_ref_01', seq: 'ATGGTGCACCTGACT', label: 'Exon 1 (Start Codon)', type: 'ref', x: 60, y: 150, r: 18 },
        { id: 'node_ref_02', seq: 'CCTGAGGAGAAGTCT', label: 'Ref Wildtype (A-Allele)', type: 'ref', x: 220, y: 110, r: 20 },
        { id: 'node_var_snp', seq: 'CCTGTGGAGAAGTCT', label: 'HbS Mutation (T-Allele)', type: 'variant', x: 220, y: 200, r: 22 },
        { id: 'node_ref_03', seq: 'GCCGTTACTGCCCTG', label: 'Core Splice Acceptor', type: 'ref', x: 380, y: 150, r: 18 },
        
        // Downstream InDel Bubble
        { id: 'node_ref_04', seq: 'TGGGGCAAGGTG', label: 'Ref Intron Span', type: 'ref', x: 520, y: 110, r: 18 },
        { id: 'node_var_del', seq: '---GGCAAGGTG', label: 'Micro-Deletion (3bp ΔTGG)', type: 'variant', x: 520, y: 200, r: 20 },
        { id: 'node_ref_05', seq: 'AACGTGGATGAAGTT', label: 'Exon 2 Exon Boundary', type: 'ref', x: 680, y: 150, r: 24 }
      ];

      this.links = [
        { source: 'node_ref_01', target: 'node_ref_02', haplotype: 'REF_WILDTYPE' },
        { source: 'node_ref_01', target: 'node_var_snp', haplotype: 'VAR_PATHOGENIC' },
        { source: 'node_ref_02', target: 'node_ref_03', haplotype: 'REF_WILDTYPE' },
        { source: 'node_var_snp', target: 'node_ref_03', haplotype: 'VAR_PATHOGENIC' },
        { source: 'node_ref_03', target: 'node_ref_04', haplotype: 'REF_WILDTYPE' },
        { source: 'node_ref_03', target: 'node_var_del', haplotype: 'VAR_PATHOGENIC' },
        { source: 'node_ref_04', target: 'node_ref_05', haplotype: 'REF_WILDTYPE' },
        { source: 'node_var_del', target: 'node_ref_05', haplotype: 'VAR_PATHOGENIC' }
      ];
    }
  }

  window.PangenomeVariationGraph = PangenomeVariationGraph;
})(window);
