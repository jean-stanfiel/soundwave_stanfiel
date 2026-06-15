document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async (event) => {
        const button = event.target.closest('.reproducir-button');
        if (!button) return;
        
        event.preventDefault();
        const cancionId = button.getAttribute('data-cancion-id');
        if (!cancionId) return;
        
        try {
            button.disabled = true; 
            
            // CORRECCIÓN AQUÍ: Se agregó /api al inicio de la ruta
            const response = await fetch(`/api/canciones/${cancionId}/reproducir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al reproducir la canción');
            }
            
            const data = await response.json();
            
            if (data.success) {
                const contadorSpan = document.querySelector(`.play-counter-${cancionId}`);
                if (contadorSpan) {
                    contadorSpan.textContent = data.reproducciones;
                }
            } else {
                console.error('No se pudo reproducir la canción en el servidor');
            }
        } catch (error) {
            console.error('Error al reproducir la canción:', error);
        } finally {
            button.disabled = false; 
        }
    });
});