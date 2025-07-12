const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/:missionId', async (req, res) => {
    const missionId = req.params.missionId.padStart(3, '0');
    const userId = req.query.user;

    if (!userId) {
        return res.send(`
            <h2>❌ Lien invalide</h2>
            <p>Aucun identifiant utilisateur détecté.</p>
            <a href="https://omnimeditation.com">Retourner au site</a>
        `);
    }

    try {
        const tagName = `demande_mission_${missionId}`;
        await addTagToContact(userId, tagName);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Mission ${missionId} demandée</title>
                <meta charset="utf-8">
            </head>
            <body style="font-family: sans-serif; text-align: center; padding: 40px;">
                <h1>🎉 Mission ${missionId} enregistrée</h1>
                <p>Votre mission vous sera envoyée demain à 5h (heure de Montréal).</p>
                <a href="https://omnimeditation.com">🏠 Retour au site</a>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).send("Erreur serveur. Réessayez plus tard.");
    }
});

async function addTagToContact(contactId, tagName) {
    const apiKey = process.env.SYSTEMIO_API_KEY;
    const baseUrl = process.env.SYSTEMIO_BASE_URL || 'https://api.systeme.io';

    const url = `${baseUrl}/contacts/${contactId}/tags`;

    await axios.post(url, { tag: tagName }, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    console.log(`✅ Tag "${tagName}" ajouté pour ${contactId}`);
}

app.listen(port, () => {
    console.log(`🚀 Serveur actif sur le port ${port}`);
});
