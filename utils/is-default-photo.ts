export function isDefaultPhoto(photoName: string): boolean {
    return defaultPhotoList().map((defaultPhoto: string) => photoName.endsWith(defaultPhoto)).every(value => value && true);
}

export function defaultPhotoList(): Array<string> {
    return [
        process.env.DEFAULT_THUMBNAIL_NAME as string,
        process.env.DEFAULT_AVATAR_NAME as string,
    ]
}