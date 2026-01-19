// Helper function to render audio player based on URL type
export const renderAudioPlayer = (audioUrl) => {
    if (!audioUrl) return null;

    // YouTube detection
    if (audioUrl.includes('youtube.com') || audioUrl.includes('youtu.be')) {
        let videoId = '';
        if (audioUrl.includes('youtube.com/watch')) {
            videoId = new URL(audioUrl).searchParams.get('v');
        } else if (audioUrl.includes('youtu.be/')) {
            videoId = audioUrl.split('youtu.be/')[1].split('?')[0];
        }

        if (videoId) {
            return (
                <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            );
        }
    }

    // Google Drive detection
    if (audioUrl.includes('drive.google.com')) {
        const fileIdMatch = audioUrl.match(/\/d\/([^/]+)/);
        if (fileIdMatch) {
            const fileId = fileIdMatch[1];
            return (
                <div className="mt-4">
                    <iframe
                        src={`https://drive.google.com/file/d/${fileId}/preview`}
                        width="100%"
                        height="80"
                        allow="autoplay"
                        className="rounded-lg"
                    />
                </div>
            );
        }
    }

    // Default: Direct audio file
    return (
        <div className="mt-4">
            <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};
