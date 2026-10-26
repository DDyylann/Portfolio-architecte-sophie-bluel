// C’est le conteneur dans lequel on ajoutera les projets
const gallery = document.querySelector(".gallery");

// Demander les projets à l’API, fetch envoie une requete à l'adresse de l'API
// await met en fonction en pause jusqu'à la réponse
// async autorise cette pause dans la fonction
// !reponse.ok = false si le serveur répond par une erreur, dans ce cas { throw new Error (`Erreur HTTP ${reponse.status}`);} déclenche une erreur
// reponse.json() transforme la réponse du serveur en tableau JavasScript utilisable
// try / catch évite que la page plante: si le serveur est éteint ou une erreur, le catch l'affiche dans la console et renvoie un tableau vide [] 
async function getWorks() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        if (!reponse.ok) { throw new Error (`Erreur HTTP ${reponse.status}`);}
        return await reponse.json();
    } catch (error) {
        console.error("Impossible de récupérer les travaux :", error);
        return [];
    }
}

function displayWorks(works) {
    // Vide la galerie avant de la remplir
    gallery.innerHTML = "";
    // Répète le contenu des accolades pour chaque projet du tableau. À chaque tour, work désigne un projet ({id, title, imageUrl, ...})
    works.forEach((work) => {
        // Création des nouvelles balises en mémoire uniquement pour l'instant
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        // On remplit ensuite ces balises avec les données de l'API: img.src même logique pour le .alt et le .textContent
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        // appendChild emboîte les éléments: l'image et la légende dans la <figure>, puis la <figure> dans la galerie
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// init enchaîne les deux étapes dans l'ordre: on attend d'abord la liste des projets (await getWorks()), puis on la passe à displayWorks
async function init() {
    const works = await getWorks();
    displayWorks(works);
}

// Déclenche l'ensemble dès que la page charge le Script
init();