// L'adresse de base de l'API
const API_URL = "http://localhost:5678/api";


// C’est le conteneur dans lequel on ajoutera les projets
const gallery = document.querySelector(".gallery");

// C'est là qu'on placera les boutons de filtres
const filters = document.querySelector(".filters");

// Tableau vide au départ, qui contiendra tous les projets reçus de l'API, il sert de mémoire au clic sur un filtre, on filtre cette liste sans recall l'API
let allWorks = [];

// Demander les projets à l’API, fetch envoie une requete à l'adresse de l'API
// await met la fonction en pause jusqu'à la réponse
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

// Même logique que pour la function getWorks. Si elle échoue elle renvoie []: il y aura que le bouton "Tous"
async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) { throw new Error (`Erreur HTTP ${response.status}`);}
        return await response.json();
    } catch (error) {
        console.error("Impossible de récupérer les catégories :", error);
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

// Fonction qui fabrique un bouton. Deux paramètres : le texte du bouton et l'Id de catégorie associé
function createFilterButton (label, categoryId) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.classList.add("filter-btn");
    // Création du bouton, du texte et de la classe CSS filter-btn. type = "button" évite qu'il se comporte comme un bouton d'envoie s'il étais un jour dans un form

    // On branche un écouteur sur le clic. Ce qui se passe au clic
    button.addEventListener("click", () => {

        // On retire la classe active de tous les boutons, puis on le met sur celui qui vient d'être cliqué
        document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Une condition ternaire (condition ? yVrai : xFaux)
        // Si categoryId vaut null, c'est le bouton "Tous" on garde la liste complète
        // Sinon, filter parcourt allWorks et ne garde que les projets dont le categoryId est égal à celui du bouton = new tableau, allWorks n'est pas modifié
        const worksToDisplay = categoryId === null ? allWorks : allWorks.filter((work) => work.categoryId === categoryId);

        // On réutilise la fonction d'affichage existante
        displayWorks(worksToDisplay);
    });

    // return button ne place pas le bouton dans la page, elle le renvoie à celui qui l'a appelée
    return button;
}

function displayFilters(categories) {
    // On vide le conteneur des filtres
    filters.innerHTML = "";

    // On crée le bouton "Tous" ici, avec null comme id, pour dire "Pas de filtre"
    const allButton = createFilterButton("Tous", null);
    
    // On lui ajoute active car c'est l'état par défaut (l'énoncé demandait de garder cette option)
    allButton.classList.add("active");
    filters.appendChild(allButton);

    // On parcourt les catégories de l'API et on crée un bouton pour chacune, avec son nom et son Id
    categories.forEach((category) => {
        filters.appendChild(createFilterButton(category.name, category.id));
    });
}



// init enchaîne les deux étapes dans l'ordre: on attend d'abord la liste des projets (await getWorks()), puis on la passe à displayWorks
async function init() {

    // Promise.all ([]) lance les deux appels API en même temps et attend que les deux soient terminés.
    // C'est plus rapide que d'écrire await getWorks() puis await getCategories(), qui attendrait la fin du premier avant de démarrer le second
    // const [works, categories] est une affectation par décomposition: le premier résultat va dans works, le second dans categories
    const [works, categories] = await Promise.all ([getWorks(), getCategories()]);
    
    // Range la liste complètes dans la variable globale, pour que les boutons puissent la réutiliser
    allWorks = works;

    displayFilters(categories);
    displayWorks(allWorks);
}

// Déclenche l'ensemble dès que la page charge le Script
init();