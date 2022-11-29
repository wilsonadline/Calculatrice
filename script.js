// je recupere le screen et l'élément caché memory qui va nous permettre de stocker la premiere valeur de l'opération
var memoireElt = document.querySelector('#memory');
var ecranElt = document.querySelector('#screen');

// je stock la valeur de l'écran précédent
let precedent = 0;

// je stock la valeur de l'affichage 
let affichage = "";

// je stock l'operation
let operation = null;

// j'initialise la mémoire
let memoire;

window.onload = () =>{
  // je recupere tous les spans
  let touches = document.querySelectorAll("span");

  // j'ecoute chaque touche et je fais appelle à ma fonction gererTouches
  for(let touche of touches){
    touche.addEventListener("click", gererTouches)
  }

  // je mets en écoute les touches du clavier
  document.addEventListener("keydown" , gererTouches);

  // je recupere la memoire stocker dans le localStorage du navigateur
  memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) : 0;
  if(memoire != 0) memoireElt.style.display = "initial";
}


// cette function écoute si on clic sur les touches
function gererTouches(e){
  let touche;

  // je liste les touches autorisées
  const listTouches = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "Enter", "Escape"];
  // si nous avons un evenement keydown
  if(e.type === "keydown"){
    // je compare la touche appuyé au touches autoriséess
    if(listTouches.includes(e.key)){
      // j'empeche l'utilisation "par defaul" de la touche
      e.preventDefault();
      touche = e.key
    }
  }else{
    // je recupere le text que contient la touche que j'ai cliqué
    touche = this.innerText;
  }

// je verifie si il s'agit d'un chiffre ou d'un point
 if(parseFloat(touche) >= 0 || touche === "."){
  // j'affiche sur le screen en la mettant à jour
  affichage = (affichage === "") ? touche.toString() : affichage + touche.toString();

  ecranElt.innerText = affichage;

 }else{
// j'utilise switch, cela evite plusieurs if
  switch(touche){
    // dans le cas ou la touche est égale à  C ou Escape, je rénitialise les valeurs
    case "C" :
      case "Escape" :
        precedent = 0;
        affichage = "";
        operation = null;
        ecranElt.innerHTML = 0;
        break;
    // dans le cas des operations
    case "+":
    case "-":
    case "*":
    case "/":
      // je calcule la valeur résultat de l'etape précédante
      precedent = (precedent === 0) ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
      // je mets à jour l'ecran
      ecranElt.innerText = precedent;
      // je stcok l'operation
      operation = touche;
      // et je réinitialise l'affichage
      affichage = "";
      break;

    // dans le cas ou la touche est = à = ou Enter
    case "=":
      case "Enter":
        // je calcule la valeur resultat de l'etape précédente
        precedent = (precedent === 0) ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
        // je mets à jour l'affichage
        ecranElt.innerText = precedent;
        // je stock le resultat de la variable d'affichage
        affichage = precedent;
        //  je réinitialise la valeur à 0
        precedent = 0;
        break;
    // Je gère la memoire
    case "M+":
      // je stock en additionnant à la valeur déjà en mémoire
      localStorage.memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) + parseFloat(affichage) : parseFloat(affichage); 
      // j'affiche le M
      memoireElt.style.display="initial";
      break;
      case "MC":
        //j'efface la memoire
        localStorage.memoire = 0
        // j'efface le M
        memoireElt.style.display="none";
        break;
      case 'MR':
        // je recupere la valeur stockée
        memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) : 0; 
        affichage = memoire;
        ecranElt.innerText = memoire
        break;
      default:
        break;
  }
 }
}

// je donne le type à mes variables et ce le type qu'ils doivent retourner
/**
  * @param {number} nb1
  * @param {number} nb2
  * @param {string} operation
  * @returns number
*/
function calculer(nb1, nb2, operation){
  nb1 = parseFloat(nb1);
  nb2 = parseFloat(nb2);

  if(operation === "+") return nb1 + nb2;
  if(operation === "-") return nb1 - nb2;
  if(operation === "*") return nb1 * nb2;
  if(operation === "/") {
    if(nb2 == "0"){
      affichage = "error";
      return affichage;
    }else{    
      return nb1 / nb2
    }
  }
}
