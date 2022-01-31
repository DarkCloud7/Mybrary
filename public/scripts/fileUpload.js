const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large'))
    ready()
else
    document.getElementById('main-css').addEventListener('load', ready)

function ready() {
    const width = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
    const aspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
    const height = width / aspectRatio

    FilePond.registerPlugin(
        FilePondPluginFileEncode,
        FilePondPluginImagePreview,
        FilePondPluginImageResize
    )
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / aspectRatio,
        imageResizeTargetWidth: width,
        imageResizeTargetHeight: height
    })
    FilePond.parse(document.body)
}