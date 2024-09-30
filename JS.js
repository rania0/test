/*Affichage du formulaire*/
var addBtn=document.querySelector("#add_btn");
var codeForm=document.querySelector("#code_form");
var closeBtn=document.querySelector("#close_btn");
var closeIcon=document.querySelector("#close_icon");
addBtn.addEventListener("click",affichierForm);
function affichierForm(){
    codeForm.classList.add("active");
}
closeBtn.addEventListener("click",()=>{
    codeForm.classList.remove("active");
})
closeIcon.addEventListener("click",()=>{
    codeForm.classList.remove("active");
})
/*fin Affichage du formulaire*/
/*Ajout des étudiants*/
/*Déclarations des variables utilisées  */
etudiant=[];
var addFormBtn=document.querySelector("#addform_btn");
var nomPrenom=document.querySelector("#nomprenom");
var groupe=document.querySelector("#groupe");
var tel=document.querySelector("#tel");
var addForm=document.querySelector("#add_form");
/*fin Déclarations des variables utilisées */
addFormBtn.onclick=function(event){
    event.preventDefault();
    if (conditions()) {
        ajout();
        addForm.reset();
    }
    
}
if(localStorage.getItem("etudiant")!=null){
    etudiant= JSON.parse(localStorage.getItem("etudiant"));
}
function conditions(){
    let nom= nomPrenom.value;
    if (nom === '' || nom.length > 50) {
        alert('Veuillez entrer un nom valide (maximum 50 caractères)');
        return false; 
    }
    let classe=groupe.value;
    if (classe === '' || classe.length > 5) {
        alert('Veuillez entrer une classe valide (maximum 5 caractères)');
        return false;
    }
    let tel_num= tel.value;
    const telPattern = /^[0-9]{8}$/;
    if (!telPattern.test(tel_num)) {
        alert('Veuillez entrer un numéro de téléphone valide (8 chiffres uniquement)');
        return false;
    }
    return true;
}
/* Ajout de l'étudiant dans le localStorage*/
function ajout() {
    let image = document.querySelector("#fichier").files[0];
    let fileName = image.name;

    const existingStudent = etudiant.find((student) => student.tele === tel.value);
    if (existingStudent) {
      alert("L'étudiant existe déjà");
      return;
    }
    etudiant.push({
      nomprenom: nomPrenom.value,
      clase: groupe.value,
      tele: tel.value,
      img:fileName,
    });
    var userstring = JSON.stringify(etudiant);// convertit l'objet JavaScript etudiant en une chaîne de caractères au format JSON.
    localStorage.setItem("etudiant", userstring);//enregistre la chaîne de caractères userstring dans le localStorage avec la clé "etudiant".
    getDataFromLocal();
    closeIcon.click();
}
/*Affichage des étudiants */
function getDataFromLocal() {
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";
    // Récupérer les données de l'étudiant à partir du localStorage
    const etudiantData = JSON.parse(localStorage.getItem("etudiant")) || [];//récupère les données de l'étudiant à partir du localStorage. et (||[]:utilisée pour fournir une valeur par défaut au cas où la récupération des données du localStorage renvoie une valeur null ou undefined.)
    if (etudiantData.length === 0) {
        const messageElement = document.createElement("p");
        messageElement.classList.add("lead", "text-muted", "message");
        messageElement.textContent = "Oups!!! pas d'étudiant à afficher.";
        gridContainer.appendChild(messageElement);
        return;
    }
    etudiantData.forEach((data, index) => {
        const studentDiv = document.createElement("div");
        studentDiv.classList.add("student-box");
      
        const contentDiv = document.createElement("div"); // Conteneur pour le contenu (nom et image)
        contentDiv.classList.add("content");
      
        const nameElement = document.createElement("p");
        nameElement.textContent = data.nomprenom;
      
        const imageElement = document.createElement("img");
        imageElement.src = "images/" + data.img; // Remplacez "chemin/vers/l/image" par le chemin réel de l'image sélectionnée
      
        const classElement = document.createElement("p");
        classElement.textContent = data.clase;
      
        const telElement = document.createElement("p");
        telElement.textContent = data.tele;
      
        const iconsElement = document.createElement("div");
        iconsElement.innerHTML = `<i class="bi bi-pen btn btn-primary"></i> <i class="bi bi-trash3 btn btn-danger"></i>`;
      
        contentDiv.appendChild(nameElement);
        contentDiv.appendChild(imageElement);
        studentDiv.appendChild(contentDiv);
        studentDiv.appendChild(classElement);
        studentDiv.appendChild(telElement);
        studentDiv.appendChild(iconsElement);
        gridContainer.appendChild(studentDiv);
    });
      
  
    // Gestionnaire d'événements pour le bouton de modification
    const editButtons = document.querySelectorAll(".bi-pen");
    const codeForm = document.querySelector("#code_form2");
    const closeIcon = document.querySelector("#close2_icon");
    const closeButton = document.querySelector("#close2_btn");
    editButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        const data = etudiantData[index];
        document.querySelector("#nomprenom2").value = data.nomprenom;
        document.querySelector("#groupe2").value = data.clase;
        document.querySelector("#tel2").value = data.tele;
        document.querySelector("#tel2").setAttribute("data-old-tel", data.tele);
        document.querySelector("#code_form2").classList.add("active");
    });
      function closeForm() {
        codeForm.classList.remove("active"); // Masquer le formulaire
    }
      closeIcon.addEventListener("click", closeForm);
      closeButton.addEventListener("click", closeForm);
    });
    /*Modification d'un étudiant  */
    document.querySelector("#edit_form").addEventListener("submit", function () {
      const index = Array.from(gridContainer.children).indexOf(this.closest(".student-box"));
      // Récupérer les nouvelles valeurs des champs de formulaire
      const newName = document.querySelector("#nomprenom2").value;
      const newGroup = document.querySelector("#groupe2").value;
      const newTel = document.querySelector("#tel2").value;
      const oldTel = document.querySelector("#tel2").getAttribute("data-old-tel");
      
      // Mettre à jour les données dans le localStorage
      const updatedData = etudiantData.map((data) => {
        if (data.tele === oldTel) {
            return { ...data, nomprenom: newName, clase: newGroup, tele: newTel };//cette ligne de code crée un nouvel objet en copiant toutes les propriétés de l'objet data et en mettant à jour les propriétés spécifiées avec de nouvelles valeurs.
        }
        return data;
    });
      localStorage.setItem("etudiant", JSON.stringify(updatedData));
      
      // Mettre à jour l'affichage
      const studentDiv = gridContainer.children[index];
      studentDiv.querySelector("p:nth-child(1)").textContent = newName;//{studentDiv.querySelector("p:nth-child(1)")} sélectionne le premier élément <p> dans le studentDiv.
      studentDiv.querySelector("p:nth-child(2)").textContent = newGroup;
      studentDiv.querySelector("p:nth-child(3)").textContent = newTel;
      // Cacher le formulaire de modification
      document.querySelector("#code_form2").classList.remove("active");
    });
    // Gestionnaire d'événements pour le bouton de suppression
    const deleteButtons = document.querySelectorAll(".bi-trash3");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        supprimerEtudiant(etudiantData[index].tele);
      });
    });
}
/*Suppression d'un étudiant */
function supprimerEtudiant(tele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
        etudiant = etudiant.filter((student) => student.tele !== tele);
        localStorage.setItem("etudiant", JSON.stringify(etudiant));
        getDataFromLocal();
    }
}  
getDataFromLocal();
/*fin Affichage des étudiants  */
/* Suppression des étudiants */
var deleteBtn = document.querySelector(".btn-danger");
deleteBtn.addEventListener("click", supprimerEtudiants);
function supprimerEtudiants() {
    if (confirm("Êtes-vous sûr de vouloir supprimer tous les étudiants ?")) {
        localStorage.removeItem("etudiant");
        etudiant = [];
        const gridContainer = document.querySelector(".grid-container");
        gridContainer.innerHTML = `<p class="lead text-muted message">Oups!!! pas d'étudiant à afficher.</p>`;
        swal("Good job!", "les etudiant etre suprimer avec sucess !", "success");
    }else{
      swal("Annuler!","l'action de suprision de tout les etudiant sera anuller","error");
    }
    
}
/*fin Suppression des étudiants */ 
/* Recherche d'un étudiant */
var rechercheBtn = document.querySelector(".btn-secondary");
rechercheBtn.addEventListener("click", function() {
  var numtel = prompt("Donnez le numéro d'étudiant que vous voulez rechercher");
  
  const existingStudentIndex = etudiant.findIndex((student) => student.tele === numtel);
  
  if (existingStudentIndex !== -1) {
    const existingStudent = etudiant[existingStudentIndex];
    position =existingStudentIndex+1;
    alert("L'étudiant " + existingStudent.nomprenom + " existe déjà dans le localStorage à la position " + position);
  } else {
    alert("Oops! L'étudiant n'existe pas.");
  }
});






















 
    
  
  
