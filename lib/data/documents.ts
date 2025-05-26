// Mock data for documents
// In a real application, this would come from a database
export const documents = [
  {
    id: '1',
    title: 'Договор купли-продажи квартиры',
    templateId: '1',
    templateName: 'Договор купли-продажи',
    values: {
      seller: 'Иванов Иван Иванович',
      sellerPassport: '4500 123456, выдан ОВД Ленинского района г. Москвы 01.01.2010',
      buyer: 'Петров Петр Петрович',
      buyerPassport: '4500 654321, выдан ОВД Пресненского района г. Москвы 02.02.2012',
      propertyAddress: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      propertyDescription: 'Квартира общей площадью 60 кв.м., жилой площадью 40 кв.м., расположенная на 3 этаже 9-этажного дома',
      price: '5000000',
      paymentMethod: 'bank',
      signingDate: '2023-05-15'
    },
    createdAt: '2023-05-10T10:30:00Z',
    updatedAt: '2023-05-15T14:20:00Z'
  },
  {
    id: '2',
    title: 'Трудовой договор с программистом',
    templateId: '2',
    templateName: 'Трудовой договор',
    values: {
      employer: 'ООО "ТехноСофт"',
      employerRepresentative: 'Директор Сидоров Сидор Сидорович',
      employee: 'Кузнецов Алексей Владимирович',
      employeePassport: '4600 789012, выдан ОВД Замоскворечье г. Москвы 03.03.2015',
      position: 'Старший разработчик программного обеспечения',
      salary: '150000',
      startDate: '2023-06-01',
      contractType: 'indefinite',
      probationPeriod: '3'
    },
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  },
  {
    id: '3',
    title: 'Доверенность на представление интересов в суде',
    templateId: '3',
    templateName: 'Доверенность',
    values: {
      issuerName: 'Смирнова Елена Александровна',
      issuerPassport: '4700 345678, выдан ОВД Тверского района г. Москвы 04.04.2018',
      issuerAddress: 'г. Москва, ул. Тверская, д. 15, кв. 7',
      attorneyName: 'Соколов Дмитрий Игоревич',
      attorneyPassport: '4700 876543, выдан ОВД Басманного района г. Москвы 05.05.2016',
      attorneyAddress: 'г. Москва, ул. Басманная, д. 20, кв. 12',
      powers: ['representation', 'documents'],
      additionalPowers: '- представлять мои интересы в судебных заседаниях по делу №2-123/2023;\n- подавать и получать документы, связанные с данным делом;',
      validUntil: '2023-12-31',
      issueDate: '2023-05-25'
    },
    createdAt: '2023-05-25T11:45:00Z',
    updatedAt: '2023-05-25T11:45:00Z'
  }
];