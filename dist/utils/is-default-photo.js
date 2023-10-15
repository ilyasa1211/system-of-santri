export function isDefaultPhoto(photoName) {
    return defaultPhotoList()
        .map((defaultPhoto) => photoName.endsWith(defaultPhoto))
        .every((value) => value && true);
}
export function defaultPhotoList() {
    return [
        process.env.DEFAULT_THUMBNAIL_NAME,
        process.env.DEFAULT_AVATAR_NAME,
    ];
}
