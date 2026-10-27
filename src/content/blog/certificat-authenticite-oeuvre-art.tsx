import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Un certificat d'authenticité transforme une image en œuvre. Pour l'acheteur, c'est la preuve qu'il possède une
        pièce originale de ta main ; pour toi, c'est un gage de sérieux qui justifie ton prix et protège la valeur de
        ton travail dans le temps, y compris à la revente.
      </p>
      <p>
        Voici ce qu'un bon certificat doit contenir, ce que dit la réglementation en France, les mots à employer (et
        ceux à éviter), ainsi qu'un modèle que tu peux recopier.
      </p>

      <KeyPoints>
        <ul>
          <li>Un certificat identifie une œuvre précise : titre, date, technique, dimensions, photo et numéro unique.</li>
          <li>Il doit être daté et signé à la main par l'artiste.</li>
          <li>Écris « œuvre originale réalisée par [ton nom] » : en France, certaines formules ont une portée juridique précise.</li>
          <li>Un numéro unique vérifiable en ligne rend le certificat beaucoup plus difficile à falsifier.</li>
        </ul>
      </KeyPoints>

      <h2>Est-ce obligatoire ?</h2>
      <p>
        En France, le texte de référence est le décret n° 81-255 du 3 mars 1981, souvent appelé « décret Marcus ». Il
        encadre les ventes d'œuvres d'art et d'objets de collection pour lutter contre les fraudes. Il n'impose pas de
        « certificat d'authenticité » en tant que tel, mais oblige le vendeur, si l'acheteur le demande, à lui remettre
        un document (facture, quittance, bordereau…) précisant la nature, la composition, l'origine et l'ancienneté de
        l'œuvre.
      </p>
      <p>
        Dans la pratique, les acheteurs attendent un certificat, les galeries le demandent, et il devient indispensable
        le jour où l'œuvre est revendue. Le plus simple est donc d'en remettre un à chaque vente, avec ta facture : tu
        réponds d'avance à la demande éventuelle de l'acheteur, et tu le rassures dès l'achat.
      </p>
      <Note>
        Cet article donne des repères généraux, pas un conseil juridique. Pour une situation particulière (œuvre de
        grande valeur, succession, édition limitée complexe), rapproche-toi d'un juriste spécialisé.
      </Note>

      <h2>Les mots qui engagent</h2>
      <p>
        Le décret Marcus donne un sens précis à certaines formules employées pour décrire une œuvre. Elles sont surtout
        utilisées par les marchands et les maisons de vente, mais mieux vaut les connaître pour ne pas les employer à
        tort :
      </p>
      <Table
        head={["Formule", "Ce qu'elle signifie"]}
        rows={[
          ["« par X », « de X », « signé X »", "Garantie que X est bien l'auteur de l'œuvre."],
          ["« attribué à X »", "Il existe de sérieuses présomptions que X soit l'auteur, sans certitude."],
          ["« atelier de X »", "Œuvre réalisée dans l'atelier de X, sous sa direction, pas forcément de sa main."],
          ["« école de X »", "Œuvre d'un élève ou d'un artiste influencé par X."],
          ["« dans le goût de », « style de », « d'après X »", "Aucune garantie sur l'auteur, ni sur l'époque."],
        ]}
      />
      <p>
        Pour tes propres œuvres, la formule la plus claire est donc : <strong>« Œuvre originale réalisée par
        [prénom nom] »</strong>. Si tu proposes des reproductions (tirages, impressions), indique-le clairement : un
        tirage n'est jamais une œuvre originale, même s'il est signé.
      </p>

      <h2>Les informations à faire figurer</h2>
      <p>Un certificat sérieux permet d'identifier une œuvre précise sans aucune ambiguïté :</p>
      <ul>
        <li>
          <strong>Ton identité</strong> : nom d'artiste et, idéalement, nom civil.
        </li>
        <li>
          <strong>Le titre de l'œuvre</strong>, ou « Sans titre » suivi d'une référence.
        </li>
        <li>
          <strong>L'année de réalisation.</strong>
        </li>
        <li>
          <strong>La technique et le support</strong> : « acrylique sur toile », « graphite et fusain sur papier
          Canson 300 g »…
        </li>
        <li>
          <strong>Les dimensions</strong> : hauteur × largeur (× profondeur) en centimètres, en précisant si elles
          s'entendent avec ou sans cadre.
        </li>
        <li>
          <strong>Le caractère unique de l'œuvre</strong> : « pièce unique », ou pour une édition limitée « tirage n° 3
          sur 30 ».
        </li>
        <li>
          <strong>Une photo de l'œuvre</strong>, imprimée sur le certificat.
        </li>
        <li>
          <strong>Un numéro de certificat unique</strong>, que tu reportes aussi au dos de l'œuvre.
        </li>
        <li>
          <strong>Une déclaration d'authenticité</strong>, datée, avec le lieu.
        </li>
        <li>
          <strong>Ta signature manuscrite</strong>, de préférence identique à celle qui figure sur l'œuvre.
        </li>
      </ul>
      <p>
        Tu peux ajouter des informations utiles à l'acheteur : conseils de conservation, encadrement d'origine, historique
        des expositions. En revanche, évite d'y inscrire le prix : le certificat accompagne l'œuvre toute sa vie, y
        compris lors d'une revente ou d'un don.
      </p>

      <h2>Modèle de certificat d'authenticité</h2>
      <p>Tu peux recopier et adapter ce texte :</p>
      <pre>{`CERTIFICAT D'AUTHENTICITÉ — N° [AAAA-0001]

Je soussigné(e) [Prénom Nom], artiste [nom d'artiste si différent],
certifie que l'œuvre décrite ci-dessous est une œuvre originale
réalisée de ma main.

Titre : [Titre de l'œuvre]
Année de réalisation : [AAAA]
Technique et support : [ex. acrylique sur toile de lin]
Dimensions : [H] × [L] cm (sans cadre)
Nature : pièce unique   [ou : tirage n° __ sur __]
Signature sur l'œuvre : [emplacement, ex. en bas à droite]

[Photo de l'œuvre]

Fait à [ville], le [date]

Signature de l'artiste :`}</pre>

      <h2>Rendre ton certificat difficile à falsifier</h2>
      <p>
        Un document Word imprimé se recopie en deux minutes. Quelques précautions simples changent tout :
      </p>
      <ul>
        <li>
          <strong>Un numéro unique</strong>, inscrit sur le certificat et au dos de l'œuvre, et noté dans ton propre
          registre (titre, date, acheteur).
        </li>
        <li>
          <strong>Une vérification en ligne</strong> : une page publique, accessible par un QR code, qui confirme que ce
          numéro correspond bien à cette œuvre. C'est le moyen le plus sûr de prouver l'authenticité des années plus
          tard.
        </li>
        <li>
          <strong>Une signature manuscrite à l'encre</strong>, jamais une signature scannée.
        </li>
        <li>
          <strong>Un papier de qualité</strong>, éventuellement avec un tampon ou un embossage.
        </li>
      </ul>

      <h2>Les erreurs les plus fréquentes</h2>
      <ul>
        <li>Oublier les dimensions ou ne pas préciser si elles incluent le cadre.</li>
        <li>Utiliser le même modèle pour toutes les œuvres sans photo : le certificat n'identifie alors rien.</li>
        <li>Présenter un tirage comme une œuvre originale.</li>
        <li>Perdre la trace des certificats émis : sans registre, impossible de confirmer une authenticité plus tard.</li>
      </ul>
      <p>
        Un bon certificat rassure aussi au moment de l'achat en ligne : c'est l'un des éléments qui permettent de{" "}
        <Link href="/blog/vendre-oeuvres-en-ligne-sans-commission">vendre en direct, sans passer par une plateforme</Link>.
      </p>

      <DrawifulCta
        title="Des certificats numérotés, vérifiables en ligne"
        text="Avec Drawiful, chaque œuvre peut recevoir un certificat d'authenticité numéroté, avec ta signature et une page de vérification publique accessible par QR code. Ton acheteur peut prouver l'authenticité de son œuvre à tout moment."
      />
    </>
  );
}
