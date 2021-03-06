--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE CURRENCY ADD COLUMN ACTIVE BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE CURRENCY SET ACTIVE='t';


CREATE TABLE CURRENCY_TMP (
  ID BIGINT PRIMARY KEY,
  CODE CHAR(3) NOT NULL,
  NAME VARCHAR(48) NOT NULL,
  ACTIVE BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (008, 'ALL', 'Albanian lek');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (012, 'DZD', 'Algerian dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (032, 'ARS', 'Algerian dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (036, 'AUD', 'Australian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (044, 'BSD', 'Bahamian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (048, 'BHD', 'Bahraini dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (050, 'BDT', '৳');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (051, 'AMT', 'դր');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (052, 'BBD', 'Barbados dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (060, 'BMD', 'Bermudian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (064, 'BTN', 'Butanese ngultrum');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (068, 'BOB', 'Boliviano');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (072, 'BWP', 'Botswana pula');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (084, 'BZD', 'Belize dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (090, 'SBD', 'Solomon islands dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (096, 'BND', 'Brunei dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (104, 'MMK', 'Myanmar kyat');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (108, 'BIF', 'Burundian frank');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (116, 'KHR', '៛');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (124, 'CAD', 'Canadian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (132, 'CVE', 'Cape verde escudo');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (136, 'KYD', 'Cayman islands dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (144, 'LKS', 'Sri lankan rupee');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (152, 'CLP', 'Chilean peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (156, 'CNY', '元');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (170, 'COP', 'Colombian peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (174, 'KMF', 'Comoro franc');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (188, 'CRC', 'Costa rican colon');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (191, 'HRK', 'Croatian kuna');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (192, 'CUP', 'Cuban peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (203, 'CZK', 'Czech koruna');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (208, 'DKK', 'Danish krone');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (214, 'DOP', 'Dominican peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (222, 'SVC', 'Salvadoran colon');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (230, 'ETB', 'Ethiopean birr');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (232, 'ERN', 'Eritrean nakfa');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (238, 'FKP', 'Falkland islands pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (242, 'FJD', 'Fiji dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (262, 'DJF', 'Djiboutian frank');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (270, 'GMD', 'Gambian dalasi');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (292, 'GIP', 'Gibraltar pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (320, 'GTQ', 'Guatemalan quetzal');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (324, 'GNF', 'Guinean franc');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (328, 'GYD', 'Guyanese dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (332, 'HTG', 'Haitian gourde');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (340, 'HNL', 'Honduran lempira');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (344, 'HKD', 'Hong Kong dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (348, 'HUF', 'Hungarian forint');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (352, 'ISK', 'Icelandic króna');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (356, 'INR', '₹');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (360, 'IDR', 'Indonesian rupiah');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (364, 'IRR', 'Iranian rial');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (368, 'IQD', 'Iraqi dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (376, 'ILS', '₪');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (388, 'JMD', 'Jamaican dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (392, 'JPY', '¥');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (398, 'KZT', '₸');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (400, 'JOD', 'Jordanian dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (404, 'KES', 'Kenyan shilling');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (408, 'KPW', 'North Korean won');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (410, 'KRW', 'South Korean won');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (414, 'KWD', 'Kuwaiti dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (417, 'KGS', 'Kyrgyzstani som');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (418, 'LAK', '₭');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (422, 'LBP', 'Lebanese pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (426, 'LSL', 'Lesotho loti');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (430, 'LRD', 'Liberian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (434, 'LYD', 'Libyan dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (446, 'MOP', 'Macanese pataca');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (454, 'MWK', 'Malawian kwacha');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (458, 'MYR', 'Malaysian ringgit');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (462, 'MVR', 'Maldivian rufiyaa');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (480, 'MUR', 'Mauritian rupee');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (484, 'MXN', 'Mexican peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (496, 'MNT', '₮');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (498, 'MDL', 'Moldovan leu');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (504, 'MAD', 'Moroccan dirham');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (512, 'OMR', 'Omani rial');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (516, 'NAD', 'Namibian dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (524, 'NPR', 'Nepalese rupee');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (532, 'ANG', 'Netherlands Antillean guilder');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (533, 'AWG', 'Aruban florin');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (548, 'VUV', 'Vanuatu vatu');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (554, 'NZD', 'New Zealand dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (558, 'NIO', 'Nicaraguan córdoba');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (566, 'NGN', 'Nigerian naira');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (578, 'NOK', 'Norwegian krone');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (586, 'PKR', 'Pakistani rupee');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (590, 'PAB', 'Panamanian balboa');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (598, 'PGK', 'Papua New Guinean kina');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (600, 'PYG', '₲');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (604, 'PEN', 'Peruvian sol');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (608, 'PHP', '₱');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (634, 'QAR', 'Qatari riyal');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (643, 'RUB', '₽');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (646, 'RWF', 'Rwandan franc');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (654, 'SHP', 'Saint Helena pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (682, 'SAR', 'Saudi riyal');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (690, 'SCR', 'Seychelles rupee');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (694, 'SLL', 'Sierra Leonean leone');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (702, 'SGD', 'Singapore dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (704, 'VND', '₫');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (706, 'SOS', 'Somali shilling');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (710, 'ZAR', 'South African rand');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (748, 'SZL', 'Swazi lilangeni');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (752, 'SEL', 'Swedish krona');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (756, 'CHF', 'Swiss franc');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (760, 'SYP', 'Syrian pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (764, 'THB', '฿');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (776, 'TOP', 'Tongan paʻanga');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (780, 'TTD', 'Trinidad and Tobago dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (784, 'AED', 'United Arab Emirates dirham');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (788, 'TND', 'Tunisian dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (800, 'UGX', 'Ugandan shilling');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (807, 'MKD', 'Macedonian denar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (818, 'EGP', 'Egyptian pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (826, 'GBP', '£');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (834, 'TZS', 'Tanzanian shilling');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (840, 'USD', '$');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (858, 'UYU', 'Uruguayan peso');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (860, 'UZS', 'Uzbekistan som');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (882, 'WST', 'Samoan tala');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (886, 'YER', 'Yemeni rial');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (901, 'TWD', 'Taiwan dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (928, 'VES', 'Venezuelan bolívar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (929, 'MRU', 'Mauritanian ouguiya');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (930, 'STN', 'São Tomé and Príncipe dobra');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (933, 'BYN', 'Belarusian ruble');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (934, 'TMT', 'Turkmenistan manat');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (936, 'GHS', 'Ghanaian cedi');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (938, 'SDG', 'Sudanese pound');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (941, 'RSD', 'Serbian dinar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (943, 'MZN', 'Mozambican metical');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (944, 'AZN', 'Azerbaijani manat');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (946, 'RON', 'Romanian leu');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (949, 'TRY', 'Turkish lira');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (951, 'XCD', 'East Caribbean dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (967, 'ZMW', 'Zambian kwacha');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (968, 'SRD', 'Surinamese dollar');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (969, 'MGA', 'Malagasy ariary');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (971, 'AFN', 'Afghan afghani');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (972, 'TJS', 'Tajikistani somoni');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (973, 'AOA', 'Angolan kwanza');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (975, 'BGN', 'Bulgarian lev');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (976, 'CDF', 'Congolese franc');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (977, 'BAM', 'Bosnia and Herzegovina convertible mark');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (978, 'EUR', '€');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (980, 'UAH', '₴');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (981, 'GEL', 'Georgian lari');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (985, 'PLN', 'Polish złoty');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (986, 'BRL', 'Brazilian real');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (440, 'LTL', 'Lithuanian litas');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (902, 'BTC', '฿');
INSERT INTO CURRENCY_TMP (ID, CODE, NAME) VALUES (903, 'ETH', 'Ξ');

DELETE FROM CURRENCY_TMP WHERE ID IN (SELECT ID FROM CURRENCY);

INSERT INTO CURRENCY SELECT * FROM CURRENCY_TMP;
DROP TABLE CURRENCY_TMP;
--rollback ALTER TABLE CURRENCY DROP COLUMN ACTIVE;
--rollback DROP TABLE CURRENCY_TMP
