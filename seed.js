const sdgs = [
    { Number: 1, Name: 'Erradicação da Pobreza', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-01.png' },
    { Number: 2, Name: 'Fome Zero e Agricultura Sustentável', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-02.png' },
    { Number: 3, Name: 'Saúde e Bem-Estar', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-03.png' },
    { Number: 4, Name: 'Educação de Qualidade', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-04.png' },
    { Number: 5, Name: 'Igualdade de Gênero', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-05.png' },
    { Number: 6, Name: 'Água Potável e Saneamento', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-06.png' },
    { Number: 7, Name: 'Energia Limpa e Acessível', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-07.png' },
    { Number: 8, Name: 'Trabalho Decente e Crescimento Econômico', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-08.png' },
    { Number: 9, Name: 'Indústria, Inovação e Infraestrutura', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-09.png' },
    { Number: 10, Name: 'Redução das Desigualdades', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-10.png' },
    { Number: 11, Name: 'Cidades e Comunidades Sustentáveis', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-11.png' },
    { Number: 12, Name: 'Consumo e Produção Responsáveis', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-12.png' },
    { Number: 13, Name: 'Ação Contra a Mudança Global do Clima', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-13.png' },
    { Number: 14, Name: 'Vida na Água', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-14.png' },
    { Number: 15, Name: 'Vida Terrestre', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-15.png' },
    { Number: 16, Name: 'Paz, Justiça e Instituições Eficazes', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-16.png' },
    { Number: 17, Name: 'Parcerias e Meios de Implementação', IconURL: 'https://minio.andrewonsik.com.br/arthemis-bucket/SDG-Icons/E-WEB-Goal-17.png' }
];

const apiUrl = 'http://localhost/brain/sdg/create'; 

for (const sdg of sdgs) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sdg)
        });
    } catch (error) {
        console.error(`Falha ao conectar na API para o ODS ${sdg.Number}`, error);
    }
}
