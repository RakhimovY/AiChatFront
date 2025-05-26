// Mock data for templates
// In a real application, this would come from a database
export const templates = [
  {
    id: '1',
    title: 'Договор купли-продажи',
    description: 'Стандартный договор купли-продажи для оформления сделок с недвижимостью',
    category: 'Недвижимость',
    fields: [
      {
        id: 'seller',
        name: 'seller',
        label: 'Продавец',
        type: 'text',
        required: true,
        description: 'ФИО продавца полностью',
      },
      {
        id: 'sellerPassport',
        name: 'sellerPassport',
        label: 'Паспортные данные продавца',
        type: 'text',
        required: true,
        description: 'Серия и номер паспорта, кем и когда выдан',
      },
      {
        id: 'buyer',
        name: 'buyer',
        label: 'Покупатель',
        type: 'text',
        required: true,
        description: 'ФИО покупателя полностью',
      },
      {
        id: 'buyerPassport',
        name: 'buyerPassport',
        label: 'Паспортные данные покупателя',
        type: 'text',
        required: true,
        description: 'Серия и номер паспорта, кем и когда выдан',
      },
      {
        id: 'propertyAddress',
        name: 'propertyAddress',
        label: 'Адрес объекта недвижимости',
        type: 'text',
        required: true,
      },
      {
        id: 'propertyDescription',
        name: 'propertyDescription',
        label: 'Описание объекта недвижимости',
        type: 'textarea',
        required: true,
        rows: 3,
      },
      {
        id: 'price',
        name: 'price',
        label: 'Стоимость',
        type: 'number',
        required: true,
        description: 'Стоимость в рублях',
      },
      {
        id: 'paymentMethod',
        name: 'paymentMethod',
        label: 'Способ оплаты',
        type: 'select',
        required: true,
        options: [
          { value: 'cash', label: 'Наличные' },
          { value: 'bank', label: 'Банковский перевод' },
          { value: 'escrow', label: 'Эскроу-счет' },
        ],
      },
      {
        id: 'signingDate',
        name: 'signingDate',
        label: 'Дата подписания',
        type: 'date',
        required: true,
      },
    ],
    content: `ДОГОВОР КУПЛИ-ПРОДАЖИ НЕДВИЖИМОСТИ

г. Москва                                                                                                                  {{signingDate}}

{{seller}}, паспорт {{sellerPassport}}, именуемый в дальнейшем "Продавец", с одной стороны, и
{{buyer}}, паспорт {{buyerPassport}}, именуемый в дальнейшем "Покупатель", с другой стороны,
заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Продавец обязуется передать в собственность Покупателя, а Покупатель обязуется принять и оплатить следующее недвижимое имущество (далее - "Объект"):
{{propertyDescription}}, расположенное по адресу: {{propertyAddress}}.

2. ЦЕНА ДОГОВОРА И ПОРЯДОК РАСЧЕТОВ

2.1. Стоимость Объекта составляет {{price}} (прописью) рублей.
2.2. Оплата производится путем {{paymentMethod === 'cash' ? 'передачи наличных денежных средств' : paymentMethod === 'bank' ? 'банковского перевода на счет Продавца' : 'открытия эскроу-счета в банке'}}.

3. ПЕРЕДАЧА ИМУЩЕСТВА

3.1. Передача Объекта Продавцом и принятие его Покупателем осуществляется по подписываемому сторонами передаточному акту.
3.2. Объект считается переданным Продавцом Покупателю с момента подписания сторонами передаточного акта.

4. ОТВЕТСТВЕННОСТЬ СТОРОН

4.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему договору стороны несут ответственность в соответствии с действующим законодательством РФ.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

5.1. Настоящий договор вступает в силу с момента его подписания сторонами и действует до полного исполнения ими своих обязательств.
5.2. Договор составлен в трех экземплярах, имеющих одинаковую юридическую силу.

6. ПОДПИСИ СТОРОН

Продавец: {{seller}} _________________ (подпись)

Покупатель: {{buyer}} _________________ (подпись)`,
    previewImage: 'https://example.com/templates/real-estate-contract.jpg',
  },
  {
    id: '2',
    title: 'Трудовой договор',
    description: 'Стандартный трудовой договор для оформления трудовых отношений',
    category: 'Трудовые отношения',
    fields: [
      {
        id: 'employer',
        name: 'employer',
        label: 'Работодатель',
        type: 'text',
        required: true,
        description: 'Полное наименование организации',
      },
      {
        id: 'employerRepresentative',
        name: 'employerRepresentative',
        label: 'Представитель работодателя',
        type: 'text',
        required: true,
        description: 'ФИО и должность',
      },
      {
        id: 'employee',
        name: 'employee',
        label: 'Работник',
        type: 'text',
        required: true,
        description: 'ФИО работника полностью',
      },
      {
        id: 'employeePassport',
        name: 'employeePassport',
        label: 'Паспортные данные работника',
        type: 'text',
        required: true,
        description: 'Серия и номер паспорта, кем и когда выдан',
      },
      {
        id: 'position',
        name: 'position',
        label: 'Должность',
        type: 'text',
        required: true,
      },
      {
        id: 'salary',
        name: 'salary',
        label: 'Заработная плата',
        type: 'number',
        required: true,
        description: 'Размер заработной платы в рублях',
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
        type: 'radio',
        required: true,
        options: [
          { value: 'indefinite', label: 'Бессрочный' },
          { value: 'fixed', label: 'Срочный' },
        ],
      },
      {
        id: 'endDate',
        name: 'endDate',
        label: 'Дата окончания договора',
        type: 'date',
        required: false,
        description: 'Только для срочного договора',
      },
      {
        id: 'probationPeriod',
        name: 'probationPeriod',
        label: 'Испытательный срок',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'Без испытательного срока' },
          { value: '1', label: '1 месяц' },
          { value: '2', label: '2 месяца' },
          { value: '3', label: '3 месяца' },
        ],
      },
    ],
    content: `ТРУДОВОЙ ДОГОВОР

г. Москва                                                                                                                  {{startDate}}

{{employer}}, в лице {{employerRepresentative}}, действующего на основании Устава, именуемое в дальнейшем "Работодатель", с одной стороны, и
{{employee}}, паспорт {{employeePassport}}, именуемый в дальнейшем "Работник", с другой стороны,
заключили настоящий трудовой договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Работник принимается на работу в должности {{position}}.
1.2. Договор является {{contractType === 'indefinite' ? 'бессрочным' : 'срочным, заключенным на срок до ' + endDate}}.
1.3. Дата начала работы: {{startDate}}.
1.4. Работнику устанавливается испытательный срок {{probationPeriod === 'none' ? 'без испытательного срока' : probationPeriod + ' месяца(ев)'}}.

2. ПРАВА И ОБЯЗАННОСТИ СТОРОН

2.1. Работник обязан:
   - добросовестно исполнять свои трудовые обязанности;
   - соблюдать правила внутреннего трудового распорядка;
   - соблюдать трудовую дисциплину;
   - бережно относиться к имуществу Работодателя.

2.2. Работодатель обязан:
   - предоставить Работнику работу по обусловленной трудовой функции;
   - обеспечить условия труда, предусмотренные трудовым законодательством;
   - своевременно и в полном размере выплачивать заработную плату.

3. ОПЛАТА ТРУДА

3.1. Работнику устанавливается заработная плата в размере {{salary}} рублей в месяц.
3.2. Заработная плата выплачивается два раза в месяц: аванс и основная часть.

4. РАБОЧЕЕ ВРЕМЯ И ВРЕМЯ ОТДЫХА

4.1. Работнику устанавливается 40-часовая рабочая неделя, 8-часовой рабочий день.
4.2. Работнику предоставляется ежегодный оплачиваемый отпуск продолжительностью 28 календарных дней.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

5.1. Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу.
5.2. Во всем остальном, что не предусмотрено настоящим договором, стороны руководствуются действующим трудовым законодательством.

6. ПОДПИСИ СТОРОН

Работодатель: _________________ (подпись)

Работник: _________________ (подпись)`,
    previewImage: 'https://example.com/templates/employment-contract.jpg',
  },
  {
    id: '3',
    title: 'Доверенность',
    description: 'Доверенность на представление интересов физического лица',
    category: 'Доверенности',
    fields: [
      {
        id: 'issuerName',
        name: 'issuerName',
        label: 'ФИО доверителя',
        type: 'text',
        required: true,
        description: 'Полное ФИО лица, выдающего доверенность',
      },
      {
        id: 'issuerPassport',
        name: 'issuerPassport',
        label: 'Паспортные данные доверителя',
        type: 'text',
        required: true,
        description: 'Серия и номер паспорта, кем и когда выдан',
      },
      {
        id: 'issuerAddress',
        name: 'issuerAddress',
        label: 'Адрес доверителя',
        type: 'text',
        required: true,
      },
      {
        id: 'attorneyName',
        name: 'attorneyName',
        label: 'ФИО доверенного лица',
        type: 'text',
        required: true,
        description: 'Полное ФИО лица, которому выдается доверенность',
      },
      {
        id: 'attorneyPassport',
        name: 'attorneyPassport',
        label: 'Паспортные данные доверенного лица',
        type: 'text',
        required: true,
        description: 'Серия и номер паспорта, кем и когда выдан',
      },
      {
        id: 'attorneyAddress',
        name: 'attorneyAddress',
        label: 'Адрес доверенного лица',
        type: 'text',
        required: true,
      },
      {
        id: 'powers',
        name: 'powers',
        label: 'Полномочия',
        type: 'checkbox',
        required: false,
        options: [
          { value: 'representation', label: 'Представление интересов в организациях' },
          { value: 'documents', label: 'Подписание документов' },
          { value: 'money', label: 'Получение денежных средств' },
          { value: 'property', label: 'Распоряжение имуществом' },
        ],
      },
      {
        id: 'additionalPowers',
        name: 'additionalPowers',
        label: 'Дополнительные полномочия',
        type: 'textarea',
        required: false,
        rows: 3,
      },
      {
        id: 'validUntil',
        name: 'validUntil',
        label: 'Срок действия',
        type: 'date',
        required: true,
      },
      {
        id: 'issueDate',
        name: 'issueDate',
        label: 'Дата выдачи',
        type: 'date',
        required: true,
      },
    ],
    content: `ДОВЕРЕННОСТЬ

г. Москва                                                                                                                  {{issueDate}}

Я, {{issuerName}}, паспорт {{issuerPassport}}, проживающий по адресу: {{issuerAddress}},

ДОВЕРЯЮ

{{attorneyName}}, паспорт {{attorneyPassport}}, проживающему по адресу: {{attorneyAddress}},

представлять мои интересы во всех учреждениях, организациях и предприятиях, со следующими полномочиями:

{{powers && powers.includes('representation') ? '- представлять мои интересы во всех государственных, административных и иных органах, учреждениях, организациях и предприятиях;' : ''}}
{{powers && powers.includes('documents') ? '- подписывать от моего имени документы;' : ''}}
{{powers && powers.includes('money') ? '- получать причитающиеся мне денежные средства;' : ''}}
{{powers && powers.includes('property') ? '- распоряжаться моим имуществом;' : ''}}
{{additionalPowers ? additionalPowers : ''}}

Доверенность выдана сроком до {{validUntil}} без права передоверия.

Подпись доверителя: _________________ ({{issuerName}})`,
    previewImage: 'https://example.com/templates/power-of-attorney.jpg',
  },
];