//Para ser possivel o uso do pdf
const PDFDocument = require('pdfkit');

//Para ser possivel o uso do CSV
const csv = require('csv-parser');
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// todas as funções em baixo vão ser métdodos do objeto donationController
const donationController = {};

donationController.list = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token, userType } = req.cookies;

  // obter toda a informação necessária da API
  const donationResponse = await fetch.default(
    "http://localhost:5000/api/donations/list",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
    }
  );
  const donationData = await donationResponse.json();

  console.log(donationData);

  console.log(donationData);
  res.render("pages/AdminArea", {
    title: "Donations Manager",
    userType: userType,
    pageType: "donation",
    donations: donationData,
  });
};

// Função para obter os dados das entidades da API
async function getEntityData(token) {
  const fetch = await import('node-fetch');

  const entityResponse = await fetch.default(
    "http://localhost:5000/api/entities/list",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );

  if (!entityResponse.ok) {
    throw new Error('Erro ao buscar os dados das entidades');
  }

  let allEntities = await entityResponse.json();

  // Filtrar apenas as entidades ativas (isActive: true)
  let activeEntities = allEntities.filter(entity => entity.isActive === true && entity.isAccepted === true);

  return activeEntities;
}

// Função para obter os dados dos doadores da API
async function getDonorData(token) {
  const fetch = await import('node-fetch');

  const donorResponse = await fetch.default(
    "http://localhost:5000/api/donors/list",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );

  if (!donorResponse.ok) {
    throw new Error('Erro ao buscar os dados dos doadores');
  }

  return await donorResponse.json();
}

// Função para obter os dados das condições da API
async function getConditionsData(token) {
  const fetch = await import('node-fetch');

  const conditionResponse = await fetch.default(
    "http://localhost:5000/api/conditions/list",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );

  if (!conditionResponse.ok) {
    throw new Error('Erro ao buscar os dados dos doadores');
  }

  return await conditionResponse.json();
}

// Rota para renderizar a página createDonationPage.ejs
donationController.createDonation = async (req, res) => {
  try {
    const { token } = req.cookies;

    // Obter os dados das entidades, doadores e condições
    const entityData = await getEntityData(token);
    const donorData = await getDonorData(token);
    const conditionData = await getConditionsData(token);

    // Renderizar o ficheiro createDonationPage.ejs na pasta donations
    res.render("donations/createDonationPage", { title: "Criar Doação", token: token, entity: entityData, donor: donorData, conditions: conditionData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página createDonationPage.");
  }
};

donationController.removeDonation = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;

  try {
    const donationId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/donations/${donationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const donationData = await response.json();

    res.redirect("/donations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao apagar." + err);
  }

}


donationController.editDonation = async (req, res) => {
  try {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token } = req.cookies;

    const donationId = req.params.id;
    const response = await fetch.default(
      `http://localhost:5000/api/donations/${donationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
      }
    );

    const DonationData = await response.json();

    // Obter os dados das entidades, doadores e condições
    const entityData = await getEntityData(token);
    const donorData = await getDonorData(token);
    const conditionData = await getConditionsData(token);

    // Renderiza a página editDonation.ejs e passa os dados do Donationistrador como parâmetro
    res.render("donations/editDonationPage", { 
      title: "Editar Doação", 
      donation: DonationData, 
      token: token, 
      entity: entityData, 
      donor: donorData, 
      conditions: conditionData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página editDonationPage." + err);
  }
};


//Função para gerar um ficheiro *.pdf com as informações das doações
donationController.generateInvoice = async (req, res) => {
  try {
    const { token } = req.cookies;
    const fetch = await import("node-fetch"); // import dinâmico porque em cima não dá
    const PDFDocument = require('pdfkit'); // Adicionando a importação do PDFKit
    const path = require('path'); // Adicionando a importação do módulo path

    // Consulta todas as doações
    const donationResponse = await fetch.default(
      "http://localhost:5000/api/donations/list",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
      }
    );
    const donations = await donationResponse.json();

    // Função para mapear os status das doações
    const mapStatus = (status) => {
      switch (status) {
        case 'received':
          return 'Recebido';
        case 'delivered':
          return 'A ser enviado';
        case 'lost':
          return 'Perdido';
        default:
          return status;
      }
    };

    // Cria um novo documento PDF
    const doc = new PDFDocument();

    // Define o nome do ficheiro de saída
    const fileName = 'Lista_de_Doacoes.pdf';

    // Cria o PDF
    doc.pipe(res);

    // Define os cabeçalhos de resposta para indicar que o conteúdo é um PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Adiciona conteúdo ao PDF
    // Adiciona o texto "Recicla Têxtil" no canto superior esquerdo
    doc.font('Helvetica').fontSize(20).fill('#008000').text('Recicla Têxtil', 50, 50);

    // Adiciona dois enters
    doc.moveDown(2);

    // Adiciona o texto 'Lista de Doações' centrado no início do documento
    doc.fontSize(16).fill('black').text('Lista de Doações', { align: 'center' }).moveDown();

    // Adiciona detalhes de cada doação
    for (let index = 0; index < donations.length; index++) {
      const donation = donations[index];
      doc.fontSize(12).fill('black').text(`Doação ${index + 1}:`, { underline: true }).moveDown(0.5);
      doc.fill('black').text(`Entidade: ${donation.entity.name}`, { bold: true });
      doc.fill('black').text(`Doador: ${donation.donor.name}`);
      doc.fill('black').text(`Número de Itens: ${donation.numberOfItems}`);

      // Adiciona a lista de itens ao PDF
      doc.fill('black').text('Itens:');
      for (const item of donation.items) {
        doc.fill('black').text(`- Descrição: ${item.description}, Condição: ${item.condition}, Peso: ${item.weight}`);
      }

      // Mapeia o status da doação
      const status = mapStatus(donation.status);
      doc.fill('black').text(`Status: ${status}`);
      doc.moveDown(0.5);
    }
    // Finaliza o PDF
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).send('Erro ao gerar o PDF');
  }
};


// Função para gerar o ficheiro CSV e enviar como resposta HTTP
donationController.generateInvoiceCSV = async (req, res) => {
  try {
    const { token } = req.cookies;
    const fetch = await import("node-fetch");

    // Função para mapear os status das doações
    const mapStatus = (status) => {
      switch (status) {
        case 'received':
          return 'Recebido';
        case 'delivered':
          return 'A ser enviado';
        case 'lost':
          return 'Perdido';
        default:
          return status;
      }
    };

    // Consulta todas as doações
    const donationResponse = await fetch.default(
      "http://localhost:5000/api/donations/list",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
      }
    );
    const donations = await donationResponse.json();

    // Cria o objeto CSV writer
    let csvWriter = createObjectCsvWriter({
      path: 'Lista_de_doacoes.csv',
      header: [
        { id: 'Entidade', title: 'Entidade' },
        { id: 'Doador', title: 'Doador' },
        { id: 'Número de Itens', title: 'Número de Itens' },
        { id: 'Status', title: 'Status' },
        { id: 'Descrição do Item', title: 'Descrição do Item' },
        { id: 'Condição do Item', title: 'Condição do Item' },
        { id: 'Peso do Item', title: 'Peso do Item' }
      ]
    });

    // Transforma as doações em registos CSV
    const csvRecords = [];
    let previousEntity = '';
    let previousDonor = '';
    for (const donation of donations) {
      const entity = donation.entity.name;
      const donor = donation.donor.name;
      const numberOfItems = donation.numberOfItems;
      const status = mapStatus(donation.status);
      for (const [index, item] of donation.items.entries()) {
        const itemDescription = item.description;
        const itemCondition = item.condition;
        const itemWeight = item.weight;
        const csvRecord = {
          'Entidade': index === 0 ? entity : '',
          'Doador': index === 0 ? donor : '',
          'Número de Itens': index === 0 ? numberOfItems : '',
          'Status': index === 0 ? status : '', // Incluir status apenas na primeira linha
          'Descrição do Item': itemDescription,
          'Condição do Item': itemCondition,
          'Peso do Item': itemWeight
        };
        csvRecords.push(csvRecord);
        if (index > 0) {
          csvRecords[csvRecords.length - 1]['Entidade'] = '';
          csvRecords[csvRecords.length - 1]['Doador'] = '';
          csvRecords[csvRecords.length - 1]['Número de Itens'] = '';
          csvRecords[csvRecords.length - 1]['Status'] = '';
        }
        previousEntity = entity;
        previousDonor = donor;
      }
    }

    // Escreve os dados das doações no ficheiro CSV
    await csvWriter.writeRecords(csvRecords);

    // Lê o arquivo CSV e envia como resposta
    const csvData = fs.readFileSync('Lista_de_doacoes.csv', 'utf8');
    const modifiedCSVData = csvData.replace(/,/g, ';'); // Substitui as vírgulas por ponto e vírgula
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Lista_de_doacoes.csv"`);
    res.send(modifiedCSVData);
  } catch (error) {
    console.error('Erro ao gerar o CSV:', error);
    res.status(500).send('Erro ao gerar o CSV');
  }
};


module.exports = donationController;
