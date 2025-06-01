// Templates for document generation
export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: TemplateField[];
  content: string; // Template with placeholders {{field_id}}
  previewImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to add timestamps to templates
const addTimestamps = (template: Omit<Template, 'createdAt' | 'updatedAt'>): Template => ({
  ...template,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
});

export const templates: Template[] = [
  // 1. Трудовой договор (Казахстан)
  addTimestamps({
    id: 'employment',
    title: 'Трудовой договор',
    description: 'Стандартный трудовой договор для оформления трудовых отношений между работодателем и работником в соответствии с Трудовым кодексом Республики Казахстан',
    category: 'kazakhstan-legal',
    fields: [
      {
        id: 'documentNumber',
        name: 'documentNumber',
        label: 'Номер договора',
        type: 'text',
        required: true,
        placeholder: 'ТД-2023-001',
      },
      {
        id: 'employer',
        name: 'employer',
        label: 'Работодатель',
        type: 'text',
        required: true,
        placeholder: 'ТОО "Компания"',
      },
      {
        id: 'employerBIN',
        name: 'employerBIN',
        label: 'БИН работодателя',
        type: 'text',
        required: true,
        placeholder: '123456789012',
      },
      {
        id: 'employerAddress',
        name: 'employerAddress',
        label: 'Юридический адрес работодателя',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Алматы, ул. Абая, д. 45, офис 301',
      },
      {
        id: 'employerRepresentative',
        name: 'employerRepresentative',
        label: 'Директор Сериков Данияр Маратович',
        type: 'text',
        required: true,
        placeholder: 'Директор Сериков Данияр Маратович',
      },
      {
        id: 'employee',
        name: 'employee',
        label: 'Работник',
        type: 'text',
        required: true,
        placeholder: 'Байжанов Аскар Ерланович',
      },
      {
        id: 'employeeIIN',
        name: 'employeeIIN',
        label: 'ИИН работника',
        type: 'text',
        required: true,
        placeholder: '910712300123',
      },
      {
        id: 'employeeIdDocument',
        name: 'employeeIdDocument',
        label: 'Удостоверение личности №034567891',
        type: 'text',
        required: true,
        placeholder: 'Удостоверение личности №034567891, выдано МВД РК 10.08.2017',
      },
      {
        id: 'employeeAddress',
        name: 'employeeAddress',
        label: 'Адрес проживания работника',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Алматы, ул. Жандосова, д. 15, кв. 42',
      },
      {
        id: 'position',
        name: 'position',
        label: 'Должность',
        type: 'text',
        required: true,
        placeholder: 'Менеджер по продажам',
      },
      {
        id: 'startDate',
        name: 'startDate',
        label: 'Дата начала работы',
        type: 'date',
        required: true,
      },
      {
        id: 'contractType',
        name: 'contractType',
        label: 'Тип договора',
        type: 'select',
        required: true,
        options: [
          { value: 'permanent', label: 'Бессрочный' },
          { value: 'fixed_term', label: 'Срочный' }
        ]
      },
      {
        id: 'endDate',
        name: 'endDate',
        label: 'Дата окончания договора',
        type: 'date',
        required: false,
      },
      {
        id: 'salary',
        name: 'salary',
        label: 'Заработная плата',
        type: 'number',
        required: true,
        placeholder: '250000',
      },
      {
        id: 'currency',
        name: 'currency',
        label: 'Валюта',
        type: 'select',
        required: true,
        options: [
          { value: 'KZT', label: 'Тенге (KZT)' },
          { value: 'USD', label: 'Доллар США (USD)' },
          { value: 'EUR', label: 'Евро (EUR)' }
        ]
      },
      {
        id: 'probationPeriod',
        name: 'probationPeriod',
        label: 'Испытательный срок',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'Без испытательного срока' },
          { value: '1_month', label: '1 месяц' },
          { value: '2_months', label: '2 месяца' },
          { value: '3_months', label: '3 месяца' }
        ]
      },
      {
        id: 'workSchedule',
        name: 'workSchedule',
        label: 'График работы',
        type: 'select',
        required: true,
        options: [
          { value: '5_day', label: '5-дневная рабочая неделя' },
          { value: 'shift', label: 'Сменный график' },
          { value: 'flexible', label: 'Гибкий график' }
        ]
      },
      {
        id: 'city',
        name: 'city',
        label: 'Город',
        type: 'text',
        required: true,
        placeholder: 'Алматы',
      },
    ],
    content: `ТРУДОВОЙ ДОГОВОР № {{documentNumber}}

г. {{city}}                                                                                                                  {{startDate}}

{{employer}}, БИН {{employerBIN}}, юридический адрес: {{employerAddress}}, в лице {{employerRepresentative}}, действующего на основании Устава, именуемое в дальнейшем "Работодатель", с одной стороны, и
{{employee}}, ИИН {{employeeIIN}}, удостоверение личности {{employeeIdDocument}}, проживающий по адресу: {{employeeAddress}}, именуемый в дальнейшем "Работник", с другой стороны,
заключили настоящий трудовой договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА`
  }),

  // 2. Договор купли-продажи (Казахстан)
  addTimestamps({
    id: 'real-estate',
    title: 'Договор купли-продажи',
    description: 'Стандартный договор купли-продажи недвижимости в соответствии с законодательством Республики Казахстан',
    category: 'kazakhstan-legal',
    fields: [
      {
        id: 'documentNumber',
        name: 'documentNumber',
        label: 'Номер договора',
        type: 'text',
        required: true,
        placeholder: 'КП-2023-001',
      },
      {
        id: 'seller',
        name: 'seller',
        label: 'Продавец',
        type: 'text',
        required: true,
        placeholder: 'Ахметов Нурлан Серикович',
      },
      {
        id: 'sellerIIN',
        name: 'sellerIIN',
        label: 'ИИН продавца',
        type: 'text',
        required: true,
        placeholder: '880214300456',
      },
      {
        id: 'sellerIdDocument',
        name: 'sellerIdDocument',
        label: 'Удостоверение личности №045678910',
        type: 'text',
        required: true,
        placeholder: 'Удостоверение личности №045678910, выдано МВД РК 15.03.2018',
      },
      {
        id: 'sellerAddress',
        name: 'sellerAddress',
        label: 'Адрес проживания продавца',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Нур-Султан, ул. Кунаева, д. 10, кв. 5',
      },
      {
        id: 'buyer',
        name: 'buyer',
        label: 'Покупатель',
        type: 'text',
        required: true,
        placeholder: 'Касымов Арман Бекович',
      },
      {
        id: 'buyerIIN',
        name: 'buyerIIN',
        label: 'ИИН покупателя',
        type: 'text',
        required: true,
        placeholder: '900325400789',
      },
      {
        id: 'buyerIdDocument',
        name: 'buyerIdDocument',
        label: 'Удостоверение личности №056789123',
        type: 'text',
        required: true,
        placeholder: 'Удостоверение личности №056789123, выдано МВД РК 20.05.2019',
      },
      {
        id: 'buyerAddress',
        name: 'buyerAddress',
        label: 'Адрес проживания покупателя',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Нур-Султан, ул. Сатпаева, д. 15, кв. 42',
      },
      {
        id: 'propertyType',
        name: 'propertyType',
        label: 'Тип недвижимости',
        type: 'select',
        required: true,
        options: [
          { value: 'apartment', label: 'Квартира' },
          { value: 'house', label: 'Жилой дом' },
          { value: 'room', label: 'Комната' },
          { value: 'office', label: 'Офисное помещение' },
          { value: 'retail', label: 'Торговое помещение' },
          { value: 'warehouse', label: 'Складское помещение' }
        ]
      },
      {
        id: 'propertyDescription',
        name: 'propertyDescription',
        label: 'Описание объекта',
        type: 'textarea',
        required: true,
        placeholder: 'Квартира общей площадью 60 кв.м., расположенная на 5 этаже 9-этажного дома',
      },
      {
        id: 'propertyAddress',
        name: 'propertyAddress',
        label: 'Адрес объекта',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Нур-Султан, ул. Кунаева, д. 10, кв. 5',
      },
      {
        id: 'cadastralNumber',
        name: 'cadastralNumber',
        label: 'Кадастровый номер',
        type: 'text',
        required: true,
        placeholder: '20:30:010205:1234',
      },
      {
        id: 'propertyDocuments',
        name: 'propertyDocuments',
        label: 'Акт на право собственности',
        type: 'text',
        required: true,
        placeholder: 'Акт на право собственности №123456 от 01.01.2015, выданный Департаментом юстиции г. Нур-Султан',
      },
      {
        id: 'price',
        name: 'price',
        label: 'Цена договора',
        type: 'number',
        required: true,
        placeholder: '25000000',
      },
      {
        id: 'currency',
        name: 'currency',
        label: 'Валюта',
        type: 'select',
        required: true,
        options: [
          { value: 'KZT', label: 'Тенге (KZT)' },
          { value: 'USD', label: 'Доллар США (USD)' },
          { value: 'EUR', label: 'Евро (EUR)' }
        ]
      },
      {
        id: 'paymentMethod',
        name: 'paymentMethod',
        label: 'Способ оплаты',
        type: 'select',
        required: true,
        options: [
          { value: 'cash', label: 'Наличные' },
          { value: 'bank_transfer', label: 'Банковский перевод' },
          { value: 'escrow', label: 'Эскроу-счет' }
        ]
      },
      {
        id: 'signingDate',
        name: 'signingDate',
        label: 'Дата подписания договора',
        type: 'date',
        required: true,
      },
      {
        id: 'transferDate',
        name: 'transferDate',
        label: 'Дата передачи прав',
        type: 'date',
        required: true,
      },
      {
        id: 'city',
        name: 'city',
        label: 'Город',
        type: 'text',
        required: true,
        placeholder: 'Нур-Султан',
      },
    ],
    content: `ДОГОВОР КУПЛИ-ПРОДАЖИ № {{documentNumber}}

г. {{city}}                                                                                                                  {{startDate}}

{{seller}}, ИИН {{sellerIIN}}, удостоверение личности {{sellerIdDocument}}, проживающий по адресу: {{sellerAddress}}, именуемый в дальнейшем "Продавец", с одной стороны, и
{{buyer}}, ИИН {{buyerIIN}}, удостоверение личности {{buyerIdDocument}}, проживающий по адресу: {{buyerAddress}}, именуемый в дальнейшем "Покупатель", с другой стороны,
заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА`
  }),

  // 3. Договор аренды (Казахстан)
  addTimestamps({
    id: 'rental',
    title: 'Договор аренды',
    description: 'Стандартный договор аренды жилого помещения в соответствии с законодательством Республики Казахстан',
    category: 'kazakhstan-legal',
    fields: [
      {
        id: 'documentNumber',
        name: 'documentNumber',
        label: 'Номер договора',
        type: 'text',
        required: true,
        placeholder: 'АР-2023-001',
      },
      {
        id: 'landlord',
        name: 'landlord',
        label: 'Арендодатель',
        type: 'text',
        required: true,
        placeholder: 'Сериков Марат Ерланович',
      },
      {
        id: 'landlordIIN',
        name: 'landlordIIN',
        label: 'ИИН арендодателя',
        type: 'text',
        required: true,
        placeholder: '850612300123',
      },
      {
        id: 'landlordIdDocument',
        name: 'landlordIdDocument',
        label: 'Удостоверение личности №034567891',
        type: 'text',
        required: true,
        placeholder: 'Удостоверение личности №034567891, выдано МВД РК 10.08.2017',
      },
      {
        id: 'landlordAddress',
        name: 'landlordAddress',
        label: 'Адрес проживания арендодателя',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Алматы, ул. Абая, д. 45, кв. 12',
      },
      {
        id: 'tenant',
        name: 'tenant',
        label: 'Арендатор',
        type: 'text',
        required: true,
        placeholder: 'Жумабаев Ерлан Нурланович',
      },
      {
        id: 'tenantIIN',
        name: 'tenantIIN',
        label: 'ИИН арендатора',
        type: 'text',
        required: true,
        placeholder: '920825400789',
      },
      {
        id: 'tenantIdDocument',
        name: 'tenantIdDocument',
        label: 'Удостоверение личности №056789123',
        type: 'text',
        required: true,
        placeholder: 'Удостоверение личности №056789123, выдано МВД РК 20.05.2019',
      },
      {
        id: 'tenantAddress',
        name: 'tenantAddress',
        label: 'Адрес проживания арендатора',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Алматы, ул. Жандосова, д. 15, кв. 42',
      },
      {
        id: 'propertyType',
        name: 'propertyType',
        label: 'Тип недвижимости',
        type: 'select',
        required: true,
        options: [
          { value: 'apartment', label: 'Квартира' },
          { value: 'house', label: 'Жилой дом' },
          { value: 'room', label: 'Комната' },
          { value: 'office', label: 'Офисное помещение' },
          { value: 'retail', label: 'Торговое помещение' },
          { value: 'warehouse', label: 'Складское помещение' }
        ]
      },
      {
        id: 'propertyDescription',
        name: 'propertyDescription',
        label: 'Описание объекта',
        type: 'textarea',
        required: true,
        placeholder: 'Квартира общей площадью 60 кв.м., расположенная на 5 этаже 9-этажного дома',
      },
      {
        id: 'propertyAddress',
        name: 'propertyAddress',
        label: 'Адрес объекта',
        type: 'text',
        required: true,
        placeholder: 'Республика Казахстан, г. Алматы, ул. Тимирязева, д. 15, кв. 45',
      },
      {
        id: 'cadastralNumber',
        name: 'cadastralNumber',
        label: 'Кадастровый номер',
        type: 'text',
        required: true,
        placeholder: '20:30:010205:1234',
      },
      {
        id: 'propertyDocuments',
        name: 'propertyDocuments',
        label: 'Акт на право собственности',
        type: 'text',
        required: true,
        placeholder: 'Акт на право собственности №123456 от 01.01.2015, выданный Департаментом юстиции г. Алматы',
      },
      {
        id: 'rentAmount',
        name: 'rentAmount',
        label: 'Сумма арендной платы',
        type: 'number',
        required: true,
        placeholder: '150000',
      },
      {
        id: 'currency',
        name: 'currency',
        label: 'Валюта',
        type: 'select',
        required: true,
        options: [
          { value: 'KZT', label: 'Тенге (KZT)' },
          { value: 'USD', label: 'Доллар США (USD)' },
          { value: 'EUR', label: 'Евро (EUR)' }
        ]
      },
      {
        id: 'depositAmount',
        name: 'depositAmount',
        label: 'Сумма залога',
        type: 'number',
        required: true,
        placeholder: '150000',
      },
      {
        id: 'rentDueDay',
        name: 'rentDueDay',
        label: 'День оплаты арендной платы',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1' },
          { value: '5', label: '5' },
          { value: '10', label: '10' },
          { value: '15', label: '15' },
          { value: '20', label: '20' },
          { value: '25', label: '25' }
        ]
      },
      {
        id: 'claimDescription',
        name: 'claimDescription',
        label: 'Подробное описание претензии',
        type: 'textarea',
        required: true,
        placeholder: 'Подробное описание претензии: что именно не устраивает, какие нарушения допущены и т.д.',
      },
      {
        id: 'demandType',
        name: 'demandType',
        label: 'Тип требования',
        type: 'select',
        required: true,
        options: [
          { value: 'refund', label: 'Возврат денежных средств' },
          { value: 'replacement', label: 'Замена товара' },
          { value: 'repair', label: 'Устранение недостатков' },
          { value: 'price_reduction', label: 'Уменьшение цены' },
          { value: 'compensation', label: 'Компенсация' },
          { value: 'other', label: 'Другое' }
        ]
      },
      {
        id: 'demandDetails',
        name: 'demandDetails',
        label: 'Подробное описание требований',
        type: 'textarea',
        required: true,
        placeholder: 'Подробное описание требований: сумма возврата, сроки устранения недостатков и т.д.',
      },
      {
        id: 'responseDeadline',
        name: 'responseDeadline',
        label: 'Срок ответа',
        type: 'select',
        required: true,
        options: [
          { value: '10', label: '10 дней' },
          { value: '15', label: '15 дней' },
          { value: '30', label: '30 дней' }
        ]
      },
      {
        id: 'attachments',
        name: 'attachments',
        label: 'Перечень прилагаемых документов',
        type: 'textarea',
        required: false,
        placeholder: 'Перечень прилагаемых документов: копия чека, копия договора, фотографии товара и т.д.',
      },
      {
        id: 'issueDate',
        name: 'issueDate',
        label: 'Дата выдачи претензии',
        type: 'date',
        required: true,
      },
      {
        id: 'city',
        name: 'city',
        label: 'Город',
        type: 'text',
        required: true,
        placeholder: 'Алматы',
      },
      {
        id: 'utilitiesIncluded',
        name: 'utilitiesIncluded',
        label: 'Коммунальные услуги включены в арендную плату',
        type: 'select',
        required: true,
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' }
        ]
      }
    ],
    content: `ДОГОВОР АРЕНДЫ № {{documentNumber}}

г. {{city}}                                                                                                                  {{startDate}}

{{landlord}}, ИИН {{landlordIIN}}, удостоверение личности {{landlordIdDocument}}, проживающий по адресу: {{landlordAddress}}, именуемый в дальнейшем "Арендодатель", с одной стороны, и
{{tenant}}, ИИН {{tenantIIN}}, удостоверение личности {{tenantIdDocument}}, проживающий по адресу: {{tenantAddress}}, именуемый в дальнейшем "Арендатор", с другой стороны,
заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА`
  }),

  // 4. Договор купли-продажи недвижимости (реальный пример)
  addTimestamps({
    id: "real_estate_sale_2024",
    title: "Договор купли-продажи недвижимости",
    description: "Стандартный договор купли-продажи недвижимости с учетом последних изменений в законодательстве",
    category: "real_estate_sale",
    fields: [
      {
        id: "contract_number",
        name: "contract_number",
        label: "Номер договора",
        type: "text",
        required: true,
        placeholder: "Например: 123/2024"
      },
      {
        id: "contract_date",
        name: "contract_date",
        label: "Дата заключения договора",
        type: "date",
        required: true
      },
      {
        id: "seller_full_name",
        name: "seller_full_name",
        label: "ФИО Продавца",
        type: "text",
        required: true
      },
      {
        id: "seller_passport",
        name: "seller_passport",
        label: "Паспортные данные Продавца",
        type: "text",
        required: true,
        placeholder: "Серия и номер паспорта"
      },
      {
        id: "seller_address",
        name: "seller_address",
        label: "Адрес регистрации Продавца",
        type: "text",
        required: true
      },
      {
        id: "buyer_full_name",
        name: "buyer_full_name",
        label: "ФИО Покупателя",
        type: "text",
        required: true
      },
      {
        id: "buyer_passport",
        name: "buyer_passport",
        label: "Паспортные данные Покупателя",
        type: "text",
        required: true,
        placeholder: "Серия и номер паспорта"
      },
      {
        id: "buyer_address",
        name: "buyer_address",
        label: "Адрес регистрации Покупателя",
        type: "text",
        required: true
      },
      {
        id: "property_type",
        name: "property_type",
        label: "Тип недвижимости",
        type: "select",
        required: true,
        options: [
          { value: "apartment", label: "Квартира" },
          { value: "house", label: "Жилой дом" },
          { value: "land", label: "Земельный участок" },
          { value: "commercial", label: "Коммерческая недвижимость" }
        ]
      },
      {
        id: "property_address",
        name: "property_address",
        label: "Адрес объекта недвижимости",
        type: "text",
        required: true
      },
      {
        id: "property_area",
        name: "property_area",
        label: "Площадь объекта",
        type: "text",
        required: true,
        placeholder: "Например: 50 кв.м"
      },
      {
        id: "property_cadastral",
        name: "property_cadastral",
        label: "Кадастровый номер",
        type: "text",
        required: true
      },
      {
        id: "property_price",
        name: "property_price",
        label: "Цена договора",
        type: "text",
        required: true,
        placeholder: "Например: 5 000 000 (Пять миллионов) рублей"
      },
      {
        id: "payment_method",
        name: "payment_method",
        label: "Способ оплаты",
        type: "select",
        required: true,
        options: [
          { value: "cash", label: "Наличными" },
          { value: "bank_transfer", label: "Безналичный расчет" },
          { value: "mortgage", label: "Ипотека" }
        ]
      },
      {
        id: "payment_terms",
        name: "payment_terms",
        label: "Условия оплаты",
        type: "textarea",
        required: true,
        placeholder: "Опишите условия и сроки оплаты"
      }
    ],
    content: `ДОГОВОР КУПЛИ-ПРОДАЖИ НЕДВИЖИМОСТИ № {{contract_number}}

г. {{city}}                                                                                                                  {{contract_date}}

{{seller_full_name}}, именуемый(ая) в дальнейшем "Продавец", в лице {{seller_representative}}, действующего на основании {{seller_representative_document}}, с одной стороны, и
{{buyer_full_name}}, именуемый(ая) в дальнейшем "Покупатель", в лице {{buyer_representative}}, действующего на основании {{buyer_representative_document}}, с другой стороны,
заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА`
  }),

  // 5. Договор аренды жилого помещения (реальный пример)
  addTimestamps({
    id: "real_estate_lease_2024",
    title: "Договор аренды жилого помещения",
    description: "Стандартный договор аренды жилого помещения с учетом последних изменений в законодательстве",
    category: "real_estate_lease",
    fields: [
      {
        id: "contract_number",
        name: "contract_number",
        label: "Номер договора",
        type: "text",
        required: true,
        placeholder: "Например: 123/2024"
      },
      {
        id: "contract_date",
        name: "contract_date",
        label: "Дата заключения договора",
        type: "date",
        required: true
      },
      {
        id: "landlord_full_name",
        name: "landlord_full_name",
        label: "ФИО Арендодателя",
        type: "text",
        required: true
      },
      {
        id: "landlord_passport",
        name: "landlord_passport",
        label: "Паспортные данные Арендодателя",
        type: "text",
        required: true,
        placeholder: "Серия и номер паспорта"
      },
      {
        id: "landlord_address",
        name: "landlord_address",
        label: "Адрес регистрации Арендодателя",
        type: "text",
        required: true
      },
      {
        id: "tenant_full_name",
        name: "tenant_full_name",
        label: "ФИО Арендатора",
        type: "text",
        required: true
      },
      {
        id: "tenant_passport",
        name: "tenant_passport",
        label: "Паспортные данные Арендатора",
        type: "text",
        required: true,
        placeholder: "Серия и номер паспорта"
      },
      {
        id: "tenant_address",
        name: "tenant_address",
        label: "Адрес регистрации Арендатора",
        type: "text",
        required: true
      },
      {
        id: "property_type",
        name: "property_type",
        label: "Тип помещения",
        type: "select",
        required: true,
        options: [
          { value: "apartment", label: "Квартира" },
          { value: "room", label: "Комната" },
          { value: "house", label: "Жилой дом" }
        ]
      },
      {
        id: "property_address",
        name: "property_address",
        label: "Адрес помещения",
        type: "text",
        required: true
      },
      {
        id: "property_area",
        name: "property_area",
        label: "Площадь помещения",
        type: "text",
        required: true,
        placeholder: "Например: 50 кв.м"
      },
      {
        id: "rent_period",
        name: "rent_period",
        label: "Срок аренды",
        type: "select",
        required: true,
        options: [
          { value: "1_month", label: "1 месяц" },
          { value: "3_months", label: "3 месяца" },
          { value: "6_months", label: "6 месяцев" },
          { value: "1_year", label: "1 год" },
          { value: "2_years", label: "2 года" },
          { value: "3_years", label: "3 года" },
          { value: "5_years", label: "5 лет" }
        ]
      },
      {
        id: "rent_amount",
        name: "rent_amount",
        label: "Сумма арендной платы",
        type: "text",
        required: true,
        placeholder: "Например: 50 000 (Пятьдесят тысяч) рублей"
      },
      {
        id: "payment_day",
        name: "payment_day",
        label: "День оплаты",
        type: "text",
        required: true,
        placeholder: "Например: до 5 числа каждого месяца"
      },
      {
        id: "deposit_amount",
        name: "deposit_amount",
        label: "Сумма залога",
        type: "text",
        required: true,
        placeholder: "Например: 50 000 (Пятьдесят тысяч) рублей"
      },
      {
        id: 'startDate',
        name: 'startDate',
        label: 'Дата начала аренды',
        type: 'date',
        required: true
      },
      {
        id: 'endDate',
        name: 'endDate',
        label: 'Дата окончания аренды',
        type: 'date',
        required: true
      },
      {
        id: 'signingDate',
        name: 'signingDate',
        label: 'Дата подписания договора',
        type: 'date',
        required: true
      },
      {
        id: 'city',
        name: 'city',
        label: 'Город',
        type: 'text',
        required: true,
        placeholder: 'Алматы'
      },
      {
        id: 'utilitiesIncluded',
        name: 'utilitiesIncluded',
        label: 'Коммунальные услуги включены в арендную плату',
        type: 'select',
        required: true,
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' }
        ]
      }
    ],
    content: `ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ № {{contract_number}}

г. {{city}}                                                                                                                  {{contract_date}}

{{landlord_full_name}}, именуемый(ая) в дальнейшем "Арендодатель", в лице {{landlord_representative}}, действующего на основании {{landlord_representative_document}}, с одной стороны, и
{{tenant_full_name}}, именуемый(ая) в дальнейшем "Арендатор", в лице {{tenant_representative}}, действующего на основании {{tenant_representative_document}}, с другой стороны,
заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА`
  })
];
