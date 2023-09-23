/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// add an image to the gallery
export function addImage(title, author, url) {
    let urls = JSON.parse(localStorage.getItem("urls"));
    if (!urls) {urls = [];}
    let newImage = {
        imageId: new Date().getTime().toString(),
        title: title,
        author: author,
        url: url
    };
    urls.push(newImage);
    localStorage.setItem("urls", JSON.stringify(urls));
    return newImage;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    let urls = JSON.parse(localStorage.getItem("urls"));
    if (!urls) {urls = [];}
    urls = urls.filter(urls => urls.imageId !== imageId);
    localStorage.setItem("urls", JSON.stringify(urls));
}

// add a comment to an image
export function addComment(imageId, author, content) {
    let comments = JSON.parse(localStorage.getItem("comments"));
    if (!comments) {comments = [];}
    
    let newComment = {
        commentId: new Date().getTime().toString(),
        imageId: imageId,
        author: author,
        content: content,
        date: new Date()
    };

    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    return newComment;
}

// delete a comment from an image
export function deleteComment(commentId) {
    let comments = JSON.parse(localStorage.getItem("comments"));
    if (!comments) {comments = [];}
    
    comments = comments.filter(comment => comment.commentId !== commentId);
    localStorage.setItem("comments", JSON.stringify(comments));
}

