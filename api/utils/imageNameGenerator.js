function imageNameGenerator(fileExtension) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return 'profile_image_' + uniqueSuffix + fileExtension;
}

module.exports = { imageNameGenerator };