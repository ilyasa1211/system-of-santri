"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPhotoList = exports.isDefaultPhoto = void 0;
function isDefaultPhoto(photoName) {
    return defaultPhotoList().map((defaultPhoto) => photoName.endsWith(defaultPhoto)).every(value => value && true);
}
exports.isDefaultPhoto = isDefaultPhoto;
function defaultPhotoList() {
    return [
        process.env.DEFAULT_THUMBNAIL_NAME,
        process.env.DEFAULT_AVATAR_NAME,
    ];
}
exports.defaultPhotoList = defaultPhotoList;
