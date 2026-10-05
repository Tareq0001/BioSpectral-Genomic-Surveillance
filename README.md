# BioSpectral Genomic Surveillance 🧬🔬

> **Genomic Signal Processing (GSP), Voss Discrete Fourier Transform & Pangenome Bubble Surveillance**  
> *Engineered in adherence to the Cyber-Emerald Obsidian Workstation Architecture.*  
> **Author & Lead Bio-Architect:** أ. طارق ابوعشي (`Tareq0001`)

[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)
[![Signal-Processing: Cooley--Tukey--FFT](https://img.shields.io/badge/DSP-Cooley--Tukey--FFT-00ff88.svg)](#)
[![Deployment: GitHub Pages](https://img.shields.io/badge/Deployment-gh--pages-fb7185.svg)](https://tareq0001.github.io/BioSpectral-Genomic-Surveillance/)

---

## 🏛️ Executive Architecture

**BioSpectral Genomic Surveillance** applies continuous digital signal processing (DSP) to discrete nucleotide sequences ($A, C, G, T$), identifying active protein-coding exons through **Period-3 Fourier Resonance** and tracking structural genetic variation across pangenome variation graphs.

### 🔬 Core Scientific Foundations

1. **Voss Indicator Representation:**
   $$\mathbf{u}_\alpha[n] = \begin{cases} 1 & \text{if } s[n] = \alpha \\ 0 & \text{otherwise} \end{cases} \quad \text{for } \alpha \in \{A, C, G, T\}$$
2. **Genomic Total Power Spectral Density (PSD):**
   $$S[k] = \sum_{\alpha \in \{A, C, G, T\}} |X_\alpha[k]|^2 \quad \text{where } X_\alpha[k] = \sum_{n=0}^{N-1} u_\alpha[n] e^{-i \frac{2\pi}{N} k n}$$
3. **Period-3 Exon Coding Phenotype:**
   Due to biased codon usage in biological protein synthesis, coding exons display a distinct harmonic peak at frequency $f = 1/3$ ($k = N/3$). The Signal-to-Noise Ratio ($\text{SNR}_{\text{p3}}$) classifies coding potential without neural training:
   $$\text{SNR}_{\text{p3}} = \frac{S[N/3]}{\text{Median}(S)}$$
4. **De Bruijn Pangenome Variation Graph:**
   Represents population-wide genomic variation through bubble graphs distinguishing reference wildtypes from pathogenic point mutations (e.g. rs334 Sickle Cell) and structural micro-deletions ($\Delta\text{TGG}$).

---

## 🚀 Live Demo & Deployment
- **Live Workstation:** [https://tareq0001.github.io/BioSpectral-Genomic-Surveillance/](https://tareq0001.github.io/BioSpectral-Genomic-Surveillance/)
- **Repository:** [Tareq0001/BioSpectral-Genomic-Surveillance](https://github.com/Tareq0001/BioSpectral-Genomic-Surveillance)

---

## 💻 Bio CLI Commands

| Command | Usage | Description |
|---|---|---|
| `help` | `help` | Show Genomic DSP CLI reference |
| `fft` | `fft` | Run Cooley-Tukey Radix-2 FFT and Period-3 resonance analysis |
| `bubbles` | `bubbles` | Inspect detected Pangenome variation bubbles |
| `benchmark` | `benchmark` | Run 1,000,000 bp/second spectral scanning benchmark |
| `clear` | `clear` | Clear terminal console |

---

## 📄 License
MIT License. Built by أ. طارق ابوعشي.
