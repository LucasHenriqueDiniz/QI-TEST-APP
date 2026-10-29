/**
 * Largura do buraco de cada matriz e da moldura das suas alternativas, nas
 * unidades do próprio viewBox (matriz 500 de largura, alternativa 173).
 *
 * Medido em 2026-10-29 com `scripts/patterns/measure-holes.py`, que desenha
 * os SVGs no Chrome (respeitando as camadas `display:none` dos arquivos do
 * Illustrator) e pega o contorno em forma de etiqueta de cada um. Os três
 * grupos vêm de três origens: os desenhos originais (1–24 e 25–30) e o
 * gerador (31–54, que já escala o conteúdo da alternativa para a moldura).
 */
const FAMILIES = [
  { first: 1, last: 24, hole: 194.4, frame: 172.5 },
  { first: 25, last: 30, hole: 162.3, frame: 172.4 },
  { first: 31, last: 54, hole: 163.0, frame: 169.7 },
] as const;

const MATRIX_VIEWBOX_WIDTH = 500;
const OPTION_VIEWBOX_WIDTH = 173;

/**
 * Largura em que a alternativa precisa ser desenhada, como fração da largura
 * da matriz, para a moldura dela ficar do tamanho do buraco: uma forma tem
 * então o mesmo tamanho na matriz e nas alternativas. `undefined` para uma
 * chave fora da tabela.
 */
export function holeScale(questionKey: string): number | undefined {
  const number = Number(questionKey.replace(/^p/, ""));
  const family = FAMILIES.find((entry) => number >= entry.first && number <= entry.last);
  if (!family) return undefined;
  return (family.hole / MATRIX_VIEWBOX_WIDTH) * (OPTION_VIEWBOX_WIDTH / family.frame);
}
