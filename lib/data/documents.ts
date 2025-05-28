// Mock data for documents - Kazakhstan version
// In a real application, this would come from a database
export const documents = [
  {
    id: '1',
    title: 'Договор купли-продажи квартиры в Нур-Султане',
    templateId: 'real-estate',
    templateName: 'Договор купли-продажи',
    values: {
      seller: 'Ахметов Нурлан Серикович',
      sellerIIN: '880214300456',
      sellerIdDocument: 'Удостоверение личности №045678910, выдано МВД РК 15.03.2018',
      buyer: 'Касымов Арман Бекович',
      buyerIIN: '900325400789',
      buyerIdDocument: 'Удостоверение личности №056789123, выдано МВД РК 20.05.2019',
      propertyAddress: 'Республика Казахстан, г. Нур-Султан, ул. Кунаева, д. 10, кв. 5',
      propertyDescription: 'Квартира общей площадью 60 кв.м., жилой площадью 40 кв.м., расположенная на 3 этаже 9-этажного дома',
      cadastralNumber: '20:30:010205:1234',
      price: '25000000',
      currency: 'KZT',
      paymentMethod: 'bank',
      signingDate: '2023-05-15',
      documentNumber: 'КП-2023-001'
    },
    createdAt: '2023-05-10T10:30:00Z',
    updatedAt: '2023-05-15T14:20:00Z'
  },
  {
    id: '2',
    title: 'Трудовой договор с программистом',
    templateId: 'employment',
    templateName: 'Трудовой договор',
    values: {
      employer: 'ТОО "КазТехСофт"',
      employerBIN: '150540003695',
      employerAddress: 'Республика Казахстан, г. Алматы, ул. Абая, д. 45, офис 301',
      employerRepresentative: 'Директор Сериков Данияр Маратович',
      employee: 'Байжанов Аскар Ерланович',
      employeeIIN: '910712300123',
      employeeIdDocument: 'Удостоверение личности №034567891, выдано МВД РК 10.08.2017',
      employeeAddress: 'Республика Казахстан, г. Алматы, ул. Жандосова, д. 15, кв. 42',
      position: 'Старший разработчик программного обеспечения',
      salary: '650000',
      currency: 'KZT',
      startDate: '2023-06-01',
      contractType: 'indefinite',
      probationPeriod: '3',
      documentNumber: 'ТД-2023-015'
    },
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  },
  {
    id: '3',
    title: 'Доверенность на представление интересов в суде',
    templateId: 'power-of-attorney',
    templateName: 'Доверенность',
    values: {
      issuerName: 'Алиева Айгуль Маратовна',
      issuerIIN: '850417402365',
      issuerIdDocument: 'Удостоверение личности №023456789, выдано МВД РК 05.05.2016',
      issuerAddress: 'Республика Казахстан, г. Караганда, ул. Ерубаева, д. 15, кв. 7',
      attorneyName: 'Бекетов Руслан Тимурович',
      attorneyIIN: '780925301478',
      attorneyIdDocument: 'Удостоверение личности №012345678, выдано МВД РК 12.10.2015',
      attorneyAddress: 'Республика Казахстан, г. Караганда, ул. Бухар-Жырау, д. 20, кв. 12',
      powers: ['representation', 'documents'],
      additionalPowers: '- представлять мои интересы в судебных заседаниях по гражданскому делу №2-123/2023;\n- подавать и получать документы, связанные с данным делом;\n- подавать заявления в соответствии с Гражданским процессуальным кодексом Республики Казахстан;',
      validUntil: '2023-12-31',
      issueDate: '2023-05-25',
      notarized: true,
      notaryInfo: 'Нотариус г. Караганды Жумабаева А.К., лицензия №0001234',
      documentNumber: 'ДВ-2023-078'
    },
    createdAt: '2023-05-25T11:45:00Z',
    updatedAt: '2023-05-25T11:45:00Z'
  }
];
