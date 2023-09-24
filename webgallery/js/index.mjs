import { addImage, deleteImage, addComment, deleteComment } from './api.mjs';

let currentImageIndex = 0;
let currentCommentPage = 0;
const commentsPerPage = 10;
document.getElementById('author').addEventListener('input', checkInput);
document.getElementById('comment').addEventListener('input', checkInput);

checkInput();

function togglePictureCommentContainer() {
    let urls = JSON.parse(localStorage.getItem("urls"));
    let container = document.querySelector('.picture_comment_container');

    if (urls && Array.isArray(urls) && urls.length > 0) {
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
    }
} togglePictureCommentContainer(); renderImages();

document.getElementById("add_picture_form").addEventListener("submit", function (e) {
    e.preventDefault();
    const title_image = document.getElementById("title_image").value;
    const author_image = document.getElementById("author_image").value;
    const url = document.getElementById("url").value;
    document.getElementById("add_picture_form").reset();
    addImage(title_image, author_image, url);
    togglePictureCommentContainer();
    renderImages();
});


document.getElementById("nextButton").addEventListener("click", function() {
    let urls = JSON.parse(localStorage.getItem("urls"));
    if (urls && Array.isArray(urls) && currentImageIndex < urls.length - 1) {
        currentImageIndex++;
        displayImage(urls[currentImageIndex]);
        updateNavigationButtons();
    }
});

document.getElementById("backButton").addEventListener("click", function() {
    let urls = JSON.parse(localStorage.getItem("urls"));
    if (urls && Array.isArray(urls) && currentImageIndex > 0) {
        currentImageIndex--;
        displayImage(urls[currentImageIndex]);
        updateNavigationButtons();
    }
});

document.getElementById("delete_image").addEventListener("click", function () {
    let imageId = this.getAttribute('data-id'); 
    if (imageId) {
        deleteImage(imageId);

        let urls = JSON.parse(localStorage.getItem("urls")) || [];
        if (currentImageIndex >= urls.length) {
            currentImageIndex = Math.max(0, urls.length - 1);
        }

        togglePictureCommentContainer();
        renderImages();
    }
});

function renderImages() {
    let urls = JSON.parse(localStorage.getItem("urls")) || [];
    if (urls && Array.isArray(urls) && urls.length >0) {
        displayImage(urls[currentImageIndex]);
    }
    updateNavigationButtons();
}

function displayImage(urlObj) {
    let imagesContainer = document.getElementById("images");
    imagesContainer.innerHTML = '';

    let elmt = document.createElement("div");
    elmt.className = "image";
    elmt.innerHTML = `
        <div class="image-info">
            <h2>${urlObj.title}</h2>
            <p>By ${urlObj.author}</p>
        </div>
        <div><img class="pictures" src="${urlObj.url}" alt="${urlObj.title}"></div>
    `;
    imagesContainer.append(elmt);
    document.getElementById("delete_image").setAttribute('data-id', urlObj.imageId);
    document.getElementById("comment_form").setAttribute('data-id', urlObj.imageId);
    currentCommentPage = 0;
    renderComments(urlObj.imageId);
}


document.getElementById("comment_form").addEventListener("submit", function (e) {
    e.preventDefault();
    let imageId = this.getAttribute('data-id'); 
    const author = document.getElementById("author").value;
    const comment = document.getElementById("comment").value;
    document.getElementById("comment_form").reset();
    addComment(imageId, author, comment);
    checkInput()
    renderComments(imageId); 
});

function renderComment(comment) {
    let date = new Date(comment.date);
    let formattedDate = date.toLocaleDateString();
    let elmt = document.createElement("div");
    elmt.className = "comments";
    elmt.innerHTML = `
    <div class="del_content_autoher">
        <div class="delete-icon icon" data-id="${comment.commentId}" style="position: absolute; top: 10px; right: 10px;"></div>
        <p class="comment_content">${comment.content}</p>
        <p class="comment_author_date">By ${comment.author} on ${formattedDate}</p>
    </div>
    <hr>
    `;
    return elmt;
}

function renderComments(imageId) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const filteredComments = comments.filter(comment => comment.imageId === imageId).reverse();
    
    const startIdx = currentCommentPage * commentsPerPage;
    const endIdx = startIdx + commentsPerPage;
    
    const commentsToDisplay = filteredComments.slice(startIdx, endIdx);

    const commentsBox = document.getElementById("comments");
    commentsBox.innerHTML = ''; 

    for (let comment of commentsToDisplay) {
        const commentElement = renderComment(comment);
        commentsBox.appendChild(commentElement);
    }

    const prevCommentPageButton = document.getElementById("prevCommentPage");
    const nextCommentPageButton = document.getElementById("nextCommentPage");
    
    if (currentCommentPage > 0) {
        prevCommentPageButton.style.visibility = 'visible';
    } else {
        prevCommentPageButton.style.visibility = 'hidden';
    }
    
    if (filteredComments.length > endIdx) {
        nextCommentPageButton.style.visibility = 'visible';
    } else {
        nextCommentPageButton.style.visibility = 'hidden';
    }
}

document.getElementById("nextCommentPage").addEventListener("click", function () {
    currentCommentPage++;
    renderComments(document.getElementById("comment_form").getAttribute('data-id'));
});

document.getElementById("prevCommentPage").addEventListener("click", function () {
    currentCommentPage = Math.max(0, currentCommentPage - 1);  // Ensure it doesn't go below 0
    renderComments(document.getElementById("comment_form").getAttribute('data-id'));
});

document.getElementById("comments").addEventListener("click", function (event) {
    let target = event.target;
    if (target.classList.contains("delete-icon")) {  
        let commentId = target.getAttribute('data-id');
        deleteComment(commentId);
        let imageId = document.getElementById("comment_form").getAttribute('data-id');

        const comments = JSON.parse(localStorage.getItem("comments")) || [];
        const filteredComments = comments.filter(comment => comment.imageId === imageId).reverse();
        const totalCommentPages = Math.ceil(filteredComments.length / commentsPerPage);

        if (currentCommentPage >= totalCommentPages && currentCommentPage > 0) {
            currentCommentPage = 0;  
        }

        renderComments(imageId);
    }
});

function checkInput() {
    const author = document.getElementById('author').value;
    const comment = document.getElementById('comment').value;
    const postButton = document.querySelector('.postbutton');

    if (author && comment) {
        postButton.style.display = 'block';  // Shows the button
    } else {
        postButton.style.display = 'none';  // Hides the button
    }
}


function updateNavigationButtons() {
    let urls = JSON.parse(localStorage.getItem("urls"));
    const backButton = document.getElementById("backButton");
    const nextButton = document.getElementById("nextButton");

    if (urls && Array.isArray(urls)) {
        if (currentImageIndex > 0) {
            backButton.style.visibility = 'visible';
        } else {
            backButton.style.visibility = 'hidden';
        }

        if (currentImageIndex < urls.length - 1) {
            nextButton.style.visibility = 'visible';
        } else {
            nextButton.style.visibility = 'hidden';
        }
    } else {
        backButton.style.visibility = 'hidden';
        nextButton.style.visibility = 'hidden';
    }
}

document.getElementById('toggleFormBtn').addEventListener('click', function() {
    var formContainer = document.getElementById('formContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
});