const { withProjectBuildGradle } = require("@expo/config-plugins");

const MARCADOR = "// expo-config-plugin: skip-kotlin-metadata-version-check";

/**
 * Desliga a checagem de versão de metadata do Kotlin no build Android.
 *
 * O `play-services-ads` é publicado compilado com um Kotlin mais novo do que o
 * que o Expo usa para compilar, e um compilador não lê metadata de versão
 * superior à sua. O build morre em
 * `:react-native-google-mobile-ads:compileDebugKotlin`.
 *
 * **A defasagem é estrutural, não um bug de versão.** Já foi observada duas
 * vezes, com uma migração de cinco versões maiores do Expo no meio:
 *
 * | Expo | Kotlin do projeto | play-services-ads | metadata |
 * |------|-------------------|-------------------|----------|
 * | 52   | 1.9               | 24.5.0            | 2.1      |
 * | 57   | 2.1               | 25.4.0            | 2.3      |
 *
 * Subir os dois lados não resolve: o Google continua à frente. Perseguir uma
 * versão do wrapper que "encaixe" também não — o pacote fixa o SDK de anúncios
 * internamente, então isso congelaria o app num SDK antigo que o Google acaba
 * depreciando.
 *
 * A supressão é segura porque as classes com metadata nova são detalhe interno
 * do SDK do Google (`*_kt_proto_lite`, `filecompliance`, `ad_quality_metrics`);
 * nenhum código Kotlin do wrapper as consome. É a saída que o próprio
 * compilador sugere na mensagem de erro.
 *
 * Remover só se algum dia o Expo passar a compilar com Kotlin igual ou mais
 * novo que o do `play-services-ads` — e confirmando com um build nativo, que é
 * a única verificação que enxerga esta classe de erro.
 */
module.exports = function withKotlinMetadataCheck(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== "groovy") {
      throw new Error(
        "withKotlinMetadataCheck: build.gradle não é groovy, o plugin precisa ser revisto."
      );
    }
    if (cfg.modResults.contents.includes(MARCADOR)) return cfg;

    cfg.modResults.contents += `
${MARCADOR}
allprojects {
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    compilerOptions {
      freeCompilerArgs.add("-Xskip-metadata-version-check")
    }
  }
}
`;
    return cfg;
  });
};
