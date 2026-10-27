import Link from "next/link";
import { DrawifulCta, KeyPoints, Note, Table } from "@/components/blog/Article";

export default function Article() {
  return (
    <>
      <p>
        Sur un écran, une œuvre perd ce qui fait sa force : sa taille, sa présence, la façon dont elle occupe un mur. Un
        collectionneur hésite à acheter un tableau de 80 cm qu'il n'a vu qu'en vignette de quelques centimètres. Une
        galerie virtuelle en 3D lui rend cette expérience : il entre dans une salle, s'approche des œuvres et comprend
        leur échelle.
      </p>
      <p>
        Voici les différentes façons de créer une exposition virtuelle, les critères pour choisir, et les conseils pour
        qu'elle donne vraiment envie d'acheter.
      </p>

      <KeyPoints>
        <ul>
          <li>Il existe trois grandes approches : la visite 360° d'un lieu réel, les outils d'exposition virtuelle et la galerie 3D reliée à une boutique.</li>
          <li>Le critère numéro un : la visite doit fonctionner dans le navigateur d'un téléphone, sans application à installer.</li>
          <li>Les œuvres doivent être accrochées à leur taille réelle, sinon la 3D perd tout son intérêt.</li>
          <li>Une exposition virtuelle qui ne permet pas d'acheter reste une belle vitrine, pas un outil de vente.</li>
        </ul>
      </KeyPoints>

      <h2>Pourquoi exposer ses œuvres en 3D</h2>
      <ul>
        <li>
          <strong>Faire percevoir l'échelle.</strong> Voir une toile accrochée à côté d'une porte ou d'un banc dit tout
          de sa taille, bien mieux qu'une ligne de dimensions.
        </li>
        <li>
          <strong>Créer une expérience.</strong> Le visiteur se promène, revient sur une œuvre, prend son temps : c'est
          l'émotion d'une visite en galerie, depuis son canapé.
        </li>
        <li>
          <strong>Se démarquer.</strong> Une visite 3D se partage plus facilement qu'un portfolio classique et marque
          les esprits sur les réseaux.
        </li>
        <li>
          <strong>Exposer en permanence.</strong> Une exposition physique dure quelques semaines ; une galerie virtuelle
          reste ouverte jour et nuit, partout dans le monde.
        </li>
      </ul>

      <h2>Les trois façons de créer une galerie virtuelle</h2>
      <Table
        head={["Approche", "Comment ça marche", "Pour qui"]}
        rows={[
          [
            "Visite 360° d'un lieu réel",
            "Un prestataire photographie ou scanne une exposition physique, que l'on parcourt ensuite point par point",
            "Les artistes qui exposent déjà dans un lieu et veulent prolonger l'exposition",
          ],
          [
            "Outil d'exposition virtuelle (Artsteps, Kunstmatrix…)",
            "Tu choisis une salle, tu y places tes images et tu partages un lien. Certains proposent une version de base gratuite",
            "Les artistes qui veulent tester une exposition ponctuelle, ou les associations",
          ],
          [
            "Galerie 3D reliée à une boutique",
            "La salle se crée à partir de tes œuvres en ligne, et chaque tableau mène à sa fiche avec bouton d'achat",
            "Les artistes qui veulent vendre, pas seulement montrer",
          ],
        ]}
        caption="Les fonctionnalités et les tarifs de chaque outil évoluent : vérifie-les au moment de choisir."
      />

      <h2>Les critères pour bien choisir</h2>
      <ol>
        <li>
          <strong>Elle fonctionne sur téléphone, sans application.</strong> La plupart de tes visiteurs cliqueront
          depuis Instagram ou un e-mail, sur leur téléphone. Une visite qui demande d'installer une application ou un
          ordinateur puissant perd l'essentiel de son public.
        </li>
        <li>
          <strong>On se déplace librement.</strong> Certains outils font sauter le visiteur d'un point de vue fixe à
          l'autre ; une navigation libre ressemble davantage à une vraie visite.
        </li>
        <li>
          <strong>Les œuvres sont à leur taille réelle.</strong> Vérifie que l'outil utilise les dimensions que tu
          indiques, et pas seulement la taille de l'image.
        </li>
        <li>
          <strong>Elle se charge vite.</strong> Au-delà de quelques secondes d'attente, beaucoup de visiteurs
          abandonnent avant même d'entrer.
        </li>
        <li>
          <strong>On peut acheter.</strong> Chaque œuvre devrait mener à sa fiche : prix, détails, paiement. Sinon, ton
          visiteur conquis doit t'écrire, attendre, négocier… et beaucoup ne le feront pas.
        </li>
        <li>
          <strong>Elle est à ton nom.</strong> Une adresse à ton nom se retient et se partage bien mieux qu'un lien
          généré automatiquement.
        </li>
      </ol>

      <h2>Réussir son exposition virtuelle</h2>
      <h3>Choisis une sélection cohérente</h3>
      <p>
        Comme dans une vraie galerie, mieux vaut 8 à 15 œuvres qui dialoguent entre elles que 50 œuvres entassées. Pense
        au parcours : par quelle œuvre le visiteur entre-t-il ? Laquelle découvre-t-il au fond de la salle ?
      </p>
      <h3>Soigne tes photos</h3>
      <p>
        En 3D, les défauts de photo se voient encore plus : bords penchés, reflets, couleurs fausses. Photographie tes
        œuvres bien de face, à la lumière du jour indirecte, sans cadre vitré si possible, puis recadre au plus près.
      </p>
      <h3>Indique des dimensions exactes</h3>
      <p>
        Une œuvre de 30 × 40 cm affichée comme un grand format crée une déception à la réception. L'échelle exacte est
        justement ce qui rend la 3D crédible.
      </p>
      <h3>Accompagne chaque œuvre d'un cartel</h3>
      <p>
        Titre, année, technique, dimensions et prix : les mêmes informations qu'en galerie. Quelques lignes sur l'histoire
        de l'œuvre aident aussi le visiteur à s'y attacher.
      </p>

      <h2>Faire venir des visiteurs</h2>
      <ul>
        <li>
          <strong>Le lien en bio</strong>, et une courte vidéo de la visite en story ou en Reel : la 3D se montre mieux
          qu'elle ne se décrit.
        </li>
        <li>
          <strong>Un vernissage virtuel</strong> : annonce une date d'ouverture, fais un live où tu fais visiter la salle
          et réponds aux questions.
        </li>
        <li>
          <strong>Un QR code en exposition physique</strong>, pour que les visiteurs retrouvent tes œuvres et puissent
          acheter plus tard.
        </li>
        <li>
          <strong>Ta newsletter et tes anciens acheteurs</strong>, à qui tu offres une visite en avant-première.
        </li>
      </ul>
      <p>
        Une galerie virtuelle complète ton site : elle donne envie, la fiche de l'œuvre fait vendre. Si tu n'as pas
        encore de site, voici <Link href="/blog/creer-site-vendre-tableaux">comment créer un site pour vendre tes
        tableaux</Link>.
      </p>

      <DrawifulCta
        title="Ta galerie 3D, reliée à ta boutique"
        text="Avec Drawiful, ta galerie 3D se crée automatiquement à partir de tes œuvres : trois salles au choix selon ton thème, dont un salon haussmannien, des œuvres accrochées à leur taille réelle, visite fluide sur téléphone, et chaque tableau mène à sa fiche avec paiement par carte. Sans commission sur tes ventes."
      />

      <Note>
        Exemple de galerie Drawiful visitable en 3D : erwan.drawiful.art, rubrique « Visite 3D ».
      </Note>
    </>
  );
}
