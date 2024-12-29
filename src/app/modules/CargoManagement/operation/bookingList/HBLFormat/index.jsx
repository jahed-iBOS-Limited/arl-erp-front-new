import moment from "moment";
import React from "react";
import ReactQuill from "react-quill";
import { convertNumberToWords } from "../../../../_helper/_convertMoneyToWord";
import logisticsLogo from "./logisticsLogo.png";
import "./style.css";
const data = {
  title: "TERMS AND CONDITION",
  content: [
    {
      serial: "1.",
      title: "General Provision",
      content: [
        {
          title: "",
          text: ``,
        },
      ],
    },
    {
      serial: "1.",
      title: "Application and Definitions",
      content: [
        {
          title: "1.1.",
          text: ` Notwithstanding the heading Combined Transport Bill of Lading the provisions set out and referred to in this document shall also apply when the transport as described on the face of the Bill of Lading is performed by one mode of transport onlyPick-up delivery and transshipment operations caned out in the performance of the one mode transport and incident to such transport do not constitute Mecent mode of transport for the purposes of this Bill of LadingLINE is the person by whom or for whom this Bill of Lading a signed`,
        },
        {
          title: "1.2.",
          text: ` LINE is the person by whom or for whom this Bill of Lading a signedThe term "Merchant includes the shipper the person named in the B of Lading as shipper the person for whose account the Goods are handed over to the LINE, the consignee the holder of the B of Lading, the ner and the receiver of the Goods and the person who is entitled to receive the Goods on notification by the Merchant and their agents, servants and subcontractors The terms "servant "agent" or agent or subcontractor shall include all direct and indirect dependent and independent servants, agents or subcontractors engaged by the UNE including their respective agents servants and subcontractors The term "vesser" and/or "ship shall include the ocean vessel named in this Bill of Lading or any substituted vesseA "port to port shipment anses only if both the place of acceptance and the place of delivery are ports and the Bill of Lading does not in the nomination of the place of acceptance or the place of delivery on the face hereof specify any place or sport within the area of the port sc nominated`,
        },
        {
          title: "1.3.",
          text: `The LINE is not a common camer and reserves the right to accept or refuse containers) and/or Goods for camage at as sole dicreation`,
        },
      ],
    },
    {
      serial: "2.",
      title: "Soope of Contract",
      content: [
        {
          title: "2.1",
          text: `By the issue of this Bit of Lading the LINE undertones o perform or to procure the performance of the entire transport from the place at which the Goods are taken in charge (place of acceptance to the place designated for delivery in this Bit of Lading and assumes lability as set out in these conditions`,
        },
        {
          title: "2.2.1",
          text: `The LINE may at any time and without notice to the Marchant`,
        },
        {
          title: "a)",
          text: ` carry the Goods by any means of transport and any route or in anidirection whatsoever, whether within or out of the most direct or advertised or customary route and proceed beyond the port and/or place of discharge or in a direction contrary thereto or return to the onginal place and/or port of Departure`,
        },
        {
          title: "b)",
          text: ` load and unload the Goods at any place, and or store them either on shom or afloat transfer, transship, naship or forward them at any place or port, dry dock a vessel with or without cargo on board`,
        },
        {
          title: "2.2.2",
          text: ` The rights set cut under 2.21 may be invoked by the LINE for any purpose whatsoever including repairs, towing or being towed saling with or without pilots adjusting equipment or instruments, dry docking and assisting vessels in all situations Anything done in accordance with clause 2.2.1 or any delay arising therefrom is within the contractual camage and not a deviation`,
        },
      ],
    },
    {
      serial: "3.",
      title: "Time Ber",
      content: [
        {
          title: "i)",
          text: `The LINE shall be discharged of all ability under this Document unless suit is brought within nine months after the delivery of the Goods or`,
        },
        {
          title: "ii)",
          text: `the date when the Goods should have been delivernd`,
        },
      ],
    },
    {
      serial: "4.",
      title: "Law and Juniadication",
      content: [
        {
          title: "4.1",
          text: `Disputes arising under this Document shall be determined by the courts and subject to Clause 7 of this Documents in accord dance with the laws of Hong Kong`,
        },
        {
          title: "4.2",
          text: ` No proceedings may be brought before other courts unless the pates axpressly agree on both the choice of another court or arbitration tribunal and the law to be then applicable`,
        },
      ],
    },
    {
      serial: "5.",
      title: "Negotiability an Tite to the Goods",
      content: [
        {
          title: "5.1",
          text: `This Bill of Lading shall be deemed to the negotiable unless marked non negable"`,
        },
        {
          title: "5.2",
          text: ` By accepting this Bill of Lading the Merchant and his transferees agree with the LINE that unless it is marked "non-negotiables shall constitute tite to the Goods and the holder by endorsement of this Bill of Lading shall be onded to receive or to transfer the Goods herein mentioned`,
        },
      ],
    },
    {
      serial: "II.",
      title: "Performance of the Contract",
      content: [
        {
          title: "",
          text: ``,
        },
      ],
    },
    {
      serial: "6.",
      title: "Methods and Routes of Transportation",
      content: [
        {
          title: "6.1",
          text: `The LINE is entitled to perform the transport in any reasonable ner and by any reasonable means, methods and routes`,
        },
        {
          title: "6.2",
          text: `The LINE reserves the iberty to determine whether Goods and livestock shall be camed on deck on an open lorry, on an open trailer or any open railway wagon Goods (not being Goods slowed in containers other than flats or pallets) which are stated herein to be carried on deck or on open lomes, traders or railway wagons and livestock may be camed on deck, on an open lorty, on an open trailer or an open railway wagon, and if camed so are carried without responsibility on the part of the LINE for loss or damage of whatsoever nature whether caused by unseaworthiness of negligence or any other cause whatsoever`,
        },
      ],
    },
    {
      serial: "7.",
      title: "Loading and Unloading",
      content: [
        {
          title: "a)",
          text: `When collection or delivery takes place at the consignor's or consignee's premises, the place of collectio delivery shall be the usual place of loading or unloading the Goods into or from the vehicle and the LINE shall not be under any obligation to provide any plant, power or labour which may be required for the loading or unloading at such. `,
        },
        {
          title: "b)",
          text: `premises. This shall be the responsibility of the consignor or consignee at his own risk and expenseany assistance given by the LINE additional to the foregoing is given entrely at the conrsigness’s as the damage to or loss of Goods or injury to persons.`,
        },
      ],
    },
    {
      serial: "8.",
      title: "Commonness and other pocked Goods",
      content: [
        {
          title: "8.1",
          text: `The term "container shall include any trailer van or closed cargo box`,
        },
        {
          title: "8.2",
          text: ` The terms of this documents shal govem the responsibility of the UNE in connection with or ansing out of the supply of a container to the Merchant whether before or after the Goods are recorved by the LINE for transport or delivery to the Merchant`,
        },
        {
          title: "8.3",
          text: `The Goods may be slowed by the LINE in containers or articles of transport used to consolidate Goods`,
        },
        {
          title: "8.3.1",
          text: ` Goods stowed in closed containers other than flats or pallets, whether by the LINE or the Merchant, may be carried on deck on an open lorry, on an open trailer, or an open railway wagon without notice to the Merchant Such Goods, whether or not so camed, shal participate in general average and shall be deemed to be within the definition of Good for the purpose of the "Hague Rules"`,
        },
      ],
    },
    {
      serial: "9.",
      title: " Hindrance, etc affecting performance",
      content: [
        {
          title: "9.1",
          text: ` The LINE shall used reasonable endeavors to complete the transport and to delivery the Goods at the placa designated for delivery`,
        },
        {
          title: "9.2",
          text: ` If at any time the performance of the contract as evidenced by this Document in or will be affected by any hindrance risk delay difficulty or disadvantage of whatsoever kind and if by virtue of sub-clause (1) the LINE has no duty to complete (the performance of the contract, the LINE) whether or not the transport in commenced) may elect to`,
        },
        {
          title: "a)",
          text: ` test the performance of this contract as terminated and place the Goods at the Merchant's disposal at any deem sale and convenient or place which the LINE shal`,
        },
        {
          title: "b)",
          text: `deliver the Goods at the place designested for delivery in any event the LINE shall be entitled to full freight for Goods received for transpiration and additional compensation for extra costs resulting from the circumstances referred to above/`,
        },
      ],
    },
    {
      serial: "10.",
      title: "Sub-contracting",
      content: [
        {
          title: "10.1",
          text: `in addition to the liberties given to the LINE under the other the other clauses hereof and in particular clause 2 t agreed that the LINE shall be entitled to sub-contract on any terms the whole or any part of the carriage loading unloading storing was housing handling and any and all duties whatsoever undertaken by the LINE in relation to the Goods`,
        },
        {
          title: "10.2",
          text: `The expression sub-contractor in this clause shall include direct and indirect sub-contractors including adores and their respective servants and agents`,
        },
      ],
    },
    {
      serial: "11.",
      title: " Notification and Delivery",
      content: [
        {
          title: "11.1",
          text: `Any mention herein of parties to be notified of the arrival of the Goods is solely for information of the LINE and tu to give such notification shall not move the LINE in annullability nor valve the Merchant of any obligation hereunder`,
        },
        {
          title: "11.2",
          text: ` Where the camage called for by this Document is a Port to Port Shipment the LINE shal Sir beny to discharge the Goods or any part thereof without notice directly they come to hand at or on to any whort craft or place on any day and at any time whereupon the lability of the LINE (f any in respect of the Goods or that part thereof discharged as aforesaid shall wholly cause notwithstanding any custom of the port to the contrary and notwithstanding that any charges dues or other expenses may be or become payable it cras are used, other than at the request of the Merchant in circumstances where the Goods or that part thereof so discharged could have been discharged ashore without additional delay the Goods (for part thereof as the case may be) shall nevertheless not be deemed to the discharged for the purposes of this Clause and of Clause 17 (A) unt they ars discharged from such craft The Merchant shall take delivery of the Goods upon such decharge All expenses incurred by reason of the Merchants failure to take delivery of the Goods as aforesaid shall be for the Merchant's account`,
        },
        {
          title: "11.3",
          text: ` Where the camage called for by this Bit of Ladings Combined Transport, the Merchant shall take delivery of the Goods within the time provided for in the forthwith`,
        },
        {
          title: "11.4",
          text: ` If delivery of the Goods or any part there not taken by the Merchant at the time and place when and where the LINE is entitled to call upon the Merchant to take delivery thereof, whether the camage called for by this Bill of Lading is a Port to Port Shipment of Combined Transport, the LINE shall be entitled without nobo unstop the Goods or that part thereof stowed in contamers or flash and/or to store Goods or that part thereof ashore, afloat in open or under cover at the sole nsk of the Merchant Such storage shal constitute due delivery hereunder, and thereupon the liability of the LINE in respect of the Goods or that part thereof stored as aforesaid (as the case may be) shall wholly cease and the cost of such storage of paid Goods or that pan thereof stored as aforesaid (as the case may be shall wholly cease and the cost of much storage if pad or payable by the LINE or any agent or subcontractor of the LINE) shall forthwith upon demand be paid by the Merchant to the LINE`,
        },
      ],
    },
    {
      serial: "III.",
      title: "Description of Goods",
      content: [
        {
          title: "",
          text: ``,
        },
      ],
    },
    {
      serial: "12.",
      title: "Responsibility of the LINE",
      content: [
        {
          title: "",
          text: ` This Document shall be prime faces evidence of the taking in charge by the LINE of the Goods as therein described in respect of the particulars which had reasonable means of checking Proof to the contrary shall not be admissible when thus Document is issued in negotiable from and has been transferred to a third party acting in good faith`,
        },
      ],
    },
    {
      serial: "13.",
      title: "Consignor's Responsibility",
      content: [
        {
          title: "",
          text: `The Consignor shall be deemed to have guaranteed to the LINE the accuracy at the time the Goods were taken charge by the LINE of the description of the Goods, marks, numbers measurements, quantity and weight as fumished by hum and the Consignor shall indemnity the LINE against all loss damage and expenses arising or resulting from inaccuracies in or inadequacy of such particulars. The night of the LINE to such indemnity shall in no way limit has responsibility and liability under this Document to any person other than the Consignor`,
        },
      ],
    },
    {
      serial: "14.",
      title: "Dangerous Goods",
      content: [
        {
          title: "14.1",
          text: `The Consignor shall comply with rules which are mandatory according to the national Law or by reason of mational Convention relating to the camage of Goods of a dangerous nature, and shall in any case inform the LINE in writing of the exact nature of the danger before Goods of a dangerous nature are taken is charge by the LINE and indicate to it if need be, the precautions to be taken`,
        },
        {
          title: "14.2",
          text: ` If the Consignor fails to provide such information and the LINE is unaware of the dangerous nature of the Goods and the necessary precautions to be taken and at any time, they are deemed to be a hazard to life or property they may at any place be unloaded destroyed or rendered harmless as crcumstances may required without compensation, and the Consignor shall be liable for all loss damage delay or expenses ansing out of their being taken in charge or their camage, or of any service incidents thereto. The burden of proving the LINE know the exact nature of the danger contuted by the camiage of the said Goods shat rest upon the person untitled to the Goods`,
        },
        {
          title: "14.3",
          text: ` if any Goods shipped with the knowledge of the LINE as to their dangerous nature shall become a danger to the ship or cargo they may in like manner be landed at any place of destroyed or rendered innocuous by the LINE without lablity the part of the LINE except to General Awang, an`,
        },
      ],
    },
    {
      serial: "15.",
      title: " Inspection of Goods",
      content: [
        {
          title: "",
          text: ` The LINE shall be entitled but under no obligation to open any container of other package or unit at any time and to inspect the contents if it appears that the contents or any part thereof cannul say or properly be camed or camed further other at all or without incurring any additional expenses or taking any incures in relation to the continer or its contents or any part part thereof the LINE may abandon the transport thereof and/or take any measures andior cur any reasonable additional expenses and/or abilities to carry or to contains the camage or to store the same under cover or in the open at any ace which storage shall be deemed to constituto due delivery under this document. The Merchant shall indemnity the LINE against any reasonable additional expense and against all tability loss or damage arising thenstrom`,
        },
      ],
    },
    {
      serial: "16.",
      title: "Regulations relating to the Goods and Packing",
      content: [
        {
          title: "",
          text: ` The Merchant shall comply with all regulations or requirements of customs, port and other authorities and shall bears and pay all duties, taxes fines imports, expenses or losses incurred or suffered by reason thereof or any ramon of any dega, encorrect of insufficient packing marking numbering or addressing of the Goods and indemnity the LINE in respect thereof`,
        },
      ],
    },
    {
      serial: "IV.",
      title: "Liability",
      content: [
        {
          title: "",
          text: ``,
        },
      ],
    },
    {
      serial: "17.",
      title: "Responsibility of the LINE",
      content: [
        {
          title: "(A)",
          text: `Port to Port Shipment`,
        },
        {
          title: "(1)",
          text: ` When the camage called for by this Document is a Port to Port shipment, then during any time when the LINE has any responsibility by law or otherwise with respect to the Goods, the ability of the LINE for loss of or damage to the Goods will be determined in accordance with any national law making the Hague Rules, compulsory applicable to this Hill of Lading including the UK Camage of Goods by Sea Act, 1924, the `,
        },
        {
          title: "1.2.",
          text: `US Camage of Goods by Sea Act, 1938, the Water Camage of Goods Act 1936 of the Dominion of Canada and if no such national lane is compulsory applicable, then in accordance with the Hague Rules contained in the international Convention for the Unification of Captain Rules relating of Bill of Lading dated 26th August, 1924`,
        },
        {
          title: "(2)",
          text: ` if the whole of the camage undertaken by the LINE is limited to carnage from a Container Yard (CY) or Container Freight Station (CFS) in or immediately adjacent to the see terminal at the port of loading to a CY or CFS or immediately adjacent tot he sea terminal at the port of discharge, the lability of the LINE shall be determined by the Hague Rules, respective of whether the loss or damage is proved to have occurred during the period of camage at sen or prior or subsequent thereto`,
        },
      ],
    },
    {
      serial: "(B)",
      title: " Combined Transport",
      content: [
        {
          title: "1.1)",
          text: ` The LINE shall be liable for loss or damage to the Goods occuring between the time when the LINE received the Goods into s charge and the time of delivery`,
        },
        {
          title: "2)",
          text: ` The LINE shall however, be relieved of lability for any loss or damage if such loss or damage arose or resulted from its`,
        },
        {
          title: "a)",
          text: ` the wrongful act or neglect of the Consignor or the`,
        },
        {
          title: "b)",
          text: ` Consignee compliance with the instructions of the person entitled to give them`,
        },
        {
          title: "c)",
          text: ` the lack of or defective condition of packing the case of Goods which by the nature, are able to wastage or to be damaged whennot packed or when not property packed`,
        },
        {
          title: "d)",
          text: ` handing, loading, stowage or unloading of the Goods by the Consignor the Consignee or any person acting or behalf of theConsignor or the Consignee`,
        },
        {
          title: "e)",
          text: ` Inherent vice of the Goods,`,
        },
        {
          title: "f)",
          text: ` insufficiency or inadequacy of marks or numbers on the Goods, Soverings, or unit loads`,
        },
        {
          title: "g)",
          text: ` strikes or lockouts or stoppage or restraint of bour from whatever cau her partial or general`,
        },
        {
          title: "h)",
          text: ` an act, neglect or default in the navigation of a ship occurring during damage by water`,
        },
        {
          title: "i)",
          text: ` fire occurring during camage by water, unless the fire was caused by the actual fault or privity of the LINE or the water camer or bylack of exercise of due diligence to make the vessel seaworthy property to man, equip and supply the vessie or to make her fit and sale for the reception camage and preservation of the Goods`,
        },
        {
          title: "j)",
          text: ` a nuclear incident, if the operator of a nuclear installation or a person acting for him is lable for this damage under an applicantinternational conventional or national law governing lability in respect of nuclear energy`,
        },
        {
          title: "k)",
          text: ` any other cause of event which the LINE could not avoid and the consequences whereof it could not prevent by the exercise of masonable diligence`,
        },
        {
          title: "3)",
          text: ` When under paragraph 2 the LINE is not under any liability in respect of some of the factors causing the loss or damage, it shall only be able to the extent that those factors for which is lable under this Clause have contributed to the loss or damage`,
        },
        {
          title: "4)",
          text: ` The burden of proving that the loss or damage was due to one or more of the causes, or events, specified in paragraph 2 shall rest upon the LINE When the LINE establishes that in the circumstances of the the loss or damage could be attributed to one or more of the causes, or events, specified in paragraph 2 shall be presumed was so used The Claimant shall, however, be ented to prove that the loss or damage was not in fact caused either wholly or partly by one or more of these causes or events`,
        },
        {
          title: "II",
          text: ` Notwithstanding anything provided for in other clause of these Conditions, if it can be proved where the loss or damage occurred, the LINE and the Merchant shall as to lability of the LINE be entitled to require such labity to be determined by the provisions contained n any intemational convention or national law, which provisions`,
        },
        {
          title: "(i)",
          text: ` Cannot be departed from my pricate contract to the celorment of the came and`,
        },
        {
          title: "(ii)",
          text: ` would have appiled the Merchant had made a separate and direct contract with the LINE in respect of the particular stage of transport where the loss or damage occurred and received as evidence thereof any particular document which must be issued such international convention or national law shall apply`,
        },
      ],
    },
    {
      serial: "18.",
      title: "Limitation Amount",
      content: [
        {
          title: "18.1",
          text: ` When the LINE is lable for compensation en respect of loss or damage to the Goods such compensation shall be calculated by reference to the invoice value of the Goods plus freight charges and insurance if paid`,
        },
        {
          title: "18.2",
          text: ` If there be no invoice value of the Goods plus freight charges and insurance if past there be no invoice value of the Goods, the compensation shall be calculated by reference to the value of such Goods at the place and time they are delivered to the Merchant in accordance with the contract or should have been so delivered The value of the Goods shall be fixed according to the commodity exchange price or if there is not such price, according to the current market price or it there is no commodity exchange price or current market price, by reference to the normal van of Goods of the same kind and quality`,
        },
        {
          title: "18.3",
          text: ` Compensation shall not exceed u S$ 2- per kilogram of gross weight of the goods lost or damaged`,
        },
        {
          title: "18.4",
          text: ` Higher compensation may be claimed only when with the consent of the LINE the value of the Goods declared by the Merchant has been stated in this Bill of Lading in that come the amount of the declared value shall be substituted for the limits laid down in this clause Any partial loss or damage shall be adjusted pro rata on the basis of such declared alue`,
        },
        {
          title: "18.5",
          text: ` The LINE shall not in any case be habile for amount greater then the actual loss to person entitled to make the claim`,
        },
      ],
    },
    {
      serial: "19.",
      title: "Delay consequential Loss etc",
      content: [
        {
          title: "",
          text: ` The LINE does not under lake that the Goods shall arrive at any place at any particular time The LINE shail in no circumstances be lable for any direct, indirect or consequential loss or damage caused by delay whether caused by unoutstanding or un gligence or any other cause whatsoever, if the LINE is held hable for direct or indirect or consequential loss or damaged caused by delay, such ability shall in no case exceed the freight for the transport covered by this document or the value of the Goods determined in clauses 18 2 with the maximum limit as per clause 118 3`,
        },
      ],
    },
    {
      serial: "20.",
      title: "General Exemption for Liability",
      content: [
        {
          title: "",
          text: `Save as otherwise provided herein the LINE shall in.co.crcumstances be liable for direct or indirect or consequential loss or damage ansing from any cause`,
        },
      ],
    },
    {
      serial: "21.",
      title: "Merchants Packing etc",
      content: [
        {
          title: "21.1",
          text: `Without prejudice to Clause 17 (8) 12 the Merchant shall be liable for any loss, damage of injury caused by faulty or insufficient packing or try faulty loading or packing within containers and trailer and on flats when such loading or packing has been performed by the Merchant or on behalf of the Merchant, or by the defect or unsuitability or the contuners, traiers or fats, when supplied by the Merchant, and shall indemnity the LINE against any additional expenses so caused`,
        },
        {
          title: "21.2",
          text: ` if a container has not been filled, packed or sowed by the LINE the LINE shall not be able for any loss or damage to its contents and the Merchant shall cover any loss or expense incurred by the LINE if such kiss, damage or expense has been caused by`,
        },
        {
          title: "a)",
          text: ` negligent filing packing or showing of the container the contents being unsuitable for carriage in container, or`,
        },
        {
          title: "b)",
          text: ` the unsuitability or defective condition of the container unes the contener has been supplied by the LINE and`,
        },
        {
          title: "c)",
          text: ` the unsuitabaty or defective condition would not have been apparent upon reasonable Inspection at or pnor to the time when the container was filed packed or stowed`,
        },
        {
          title: "21.3",
          text: `The provisions of sub-clause (2) of this Clause trailers, transportable tanks fats pallets which havebeen filed, packed or stowed by the LINE`,
        },
        {
          title: "21.4",
          text: ` The LINE does not acompt liability for the functioning of refer equpment or  talers suppled by Merchant`,
        },
      ],
    },
    {
      serial: "22.",
      title: "Notice of loss or Damage",
      content: [
        {
          title: "",
          text: ` Unless notice of los damage to the Goods and the genre nature o given in writing to the LINE or the person acting on its behalf at the place of delivery before or at the time of the removal of the Goods into the custody of the person entitled to delivery therefor the loss or damage is not apparent within these consecutive days thereafter such removal shall be prima facies evidence of The delivery by the LINE of the Goods as described in this document and the LINE shial be discharged from all liability e respect of loss of or damage to the Goods`,
        },
      ],
    },
    {
      serial: "23.",
      title: "Defenses and Limits for the LINE and oth Persons",
      content: [
        {
          title: "23.1",
          text: `The defenses and limits of liability provided for in the Document Shall Apply in any action against the LINE for loss of or damage to the Document sha Goods whether such action is founded in contract or in tort`,
        },
        {
          title: "23.2",
          text: ` The LINE shall not be ented to be bene of imitation of fability provided for any close 163 proved that the loss or damage resulted from an act or omission of the LINE set done with intend to cause damage or rackicssy and with knowledge that damage would probably result`,
        },
        {
          title: "23.3",
          text: ` The Merchant undertakes that no claim shall be made against any servant, agent or subcontractor of the LINE or against any vessel her owner or operator, which imposes or attempts to mose upon any of them any labiety whatsoever in connectionwith the Goods and, if any such claims should never there's be made indemnity the LINE against all consequences therea`,
        },
        {
          title: "23.3.1",
          text: `Without prejudice to the foregoing, avery such person shall have the tenth of a provisions herman as if such provisions were expressly for their bene, in entering into this contract the LINE to the external of the provisions, does so not only on its behalf butalso as agent and trustee for such persons.`,
        },
        {
          title: "23.3.2",
          text: `However, it is proved that loss or damage resulted from an act or omision of wch persons done with intent to cause damage or recklessly and with knowledge that damage would probably mut such is that not be untied to the bene of limitation of sability provided for in this document`,
        },
      ],
    },
    {
      serial: "24.",
      title: "Freight",
      content: [
        {
          title: "24.1",
          text: ` Freight shall be deemed named on receipt of the Gods by the LINE and be paid in any event`,
        },
        {
          title: "24.2",
          text: ` The Merchant's attention is drawn to the stipulations concerning currency hich the freight and charges are to be paid rate of exchange, devaluation and other contingencies relative to freight and charges the rent tariff conditions if no such stipulation as to devaluation xts or in applicable the following clause to applyIf the currency in which freight and charges are quoted is devalued or revalued between the date of the freight agreement and the date when the freight and charges are paid, then all freight and charges shall be automatically and i mediately changed in proportion to the extent of the devaluation or revaluation of the said cumin When the LINE has consented to payment in other currency than the above mentioned currency, then at freight and charges shail-subject to the preceding baragraph-be past at the highest selling rate of exchange for banker's sight dral current on the day when such freight and charges are paid if the banks are closed on the day when the fright pad the rate to be used will be the one in force on the last day the banks were open`,
        },
        {
          title: "24.3",
          text: ` For the purpose of verifying the freight basis, the LINE reserves the right to have the contents of containers trailers or similar articles of transport inspected in order to ascertain the weight measurement value or nature of Goods It on such inspection it found that the declaration is not corect, it is agreed that a sum oqua eithe to five trois the difference between the correct freight and the freight charged or to double the correct freight loss the freight chered, whichever sum is the smaller shall be payable as liquidated damagesto the LINE notwithstanding any other sum having been stated on this Document as the freight payable`,
        },
        {
          title: "24.4",
          text: ` All dues, taxes and charges levied on the Goods and other expe in connection therewith shall be paid by the Merchan`,
        },
        {
          title: "24.5",
          text: ` The Merchant shall reimburse the LINE in proportion to the amount of fight for any costs by deviation or delay or any other in crease of conts of whatever nature caused by wat wank operatons, epidemics, strikes, govemment desctions or force majeure`,
        },
      ],
    },
    {
      serial: "25.",
      title: "Lien",
      content: [
        {
          title: "",
          text: ` The LINE shall have hen on the Goods for any amount due dunder enforce such lien in any reasonable manner under the contract and for the costs of recovering the same, and may`,
        },
      ],
    },
    {
      serial: "VI.",
      title: "Miscollaneous Provisions",
      content: [
        {
          title: "",
          text: ``,
        },
      ],
    },
    {
      serial: "26.",
      title: "General Average",
      content: [
        {
          title: "26.1",
          text: ` General Average to be tuted at any port or place at the LINE's option, and to be settled according to be the York Antwerp Rules 1974, this covering all Goods whether camed on or under deck. The Jew Jason Clause as approved by BMO to-be considered as incorporated here`,
        },
        {
          title: "26.2",
          text: ` The Merchant shall indemnity the LINE in respect of any clams of a General Average nature which may be made on him and shad provide`,
        },
        {
          title: "26.3",
          text: `Such security as may be required by the LINE is this connection Such security including a cash deposit as the LINE may deem sufficiant to cover the estimated contribution of the Goods any salvage and special charges themon shall if required be submited to the LIVE prior to delivery of the Good`,
        },
      ],
    },
    {
      serial: "27.",
      title: "Both-to-Blame Collision",
      content: [
        {
          title: "",
          text: `The Both-to-Blame Collision Clause as abated by BIMCO to be consered an incorporated herein.`,
        },
      ],
    },
    {
      serial: "28.",
      title: "Partiality Invatidity",
      content: [
        {
          title: "",
          text: `Should any cause or part there of this Document be found to be valid the validity of t remaining cases or the remaining part of the defective clue shall not be impaired. The invalid claus part thereof shall be refaced by an offedive claus part thereof apt as serving the purposes of the LINE and the Merchant`,
        },
      ],
    },
  ],
};
export const HBLFormatInvoice = ({
  componentRef,
  bookingData,
  htmlContent,
  changeHandelar,
}) => {
  return (
    <div className="hblWrapper">
      <SingleItem
        bookingData={bookingData}
        changeHandelar={changeHandelar}
        htmlContent={htmlContent}
      />
      <div className="multipleInvoicePrint" ref={componentRef}>
        <SingleItem
          footerText="ORIGINAL 1 (FOR CONSIGNEE)"
          bookingData={bookingData}
          htmlContent={htmlContent}
          isPrintView={true}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
        />
        <SingleItem
          footerText="ORIGINAL 2 (FOR CONSIGNEE)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
        />
        <SingleItem
          footerText="ORIGINAL 3 (FOR SHIPPER)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
          isPrintView={true}
        />
        <SingleItem
          footerText="ORIGINAL 4 (FOR SHIPPER)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
          isPrintView={true}
        />
        <div
          style={{
            fontSize: 5,
          }}
        >
          <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
            {data.title}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "20px",
            }}
          >
            {/* Left Column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "48%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {data.content.slice(0, 19).map((item, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      <span>{item?.serial}</span>
                      <span>{item?.title}</span>
                    </div>

                    {item.content.map((content, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 11fr",
                          paddingBottom: "5px",
                          paddingLeft: "20px",
                        }}
                      >
                        <span> {content.title}</span>
                        <span>{content.text}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "48%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {data.content.slice(19).map((item, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      <span>{item?.serial}</span>
                      <span>{item?.title}</span>
                    </div>

                    {item.content.map((content, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 11fr",
                          paddingBottom: "5px",
                          paddingLeft: "20px",
                        }}
                      >
                        <span> {content.title}</span>
                        <span>{content.text}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleItem = ({
  footerText = "",
  bookingData,
  changeHandelar,
  htmlContent,
  isPrintView,
}) => {
  const totalNumberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + (+item?.totalNumberOfPackages || 0);
  }, 0);

  console.log(htmlContent?.marks, "htmlContent?.marks");
  return (
    <>
      <div>
        <div className="hblContainer">
          <div className="airandConsigneeInfo">
            <div className="top borderBottom">
              <div className="leftSide borderRight">
                <div className="shipperInfo borderBottom">
                  <p className="textTitle">
                    {bookingData?.objPurchase?.[0]?.infoType === "lc"
                      ? "Shipper And Bank"
                      : "Shipper"}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.shipperBank}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.shipperBankAddress}
                  </p>
                  <p>
                    {" "}
                    {bookingData?.objPurchase?.[0]?.infoType === "lc"
                      ? "A/C "
                      : ""}
                    {bookingData?.shipperName}
                  </p>
                  <p>{bookingData?.shipperAddress}</p>
                  {/* <p>{bookingData?.shipperContactPerson}</p> */}
                  <p>{bookingData?.shipperContact}</p>
                  <p>{bookingData?.shipperEmail}</p>
                  <p>
                    {bookingData?.shipperState} ,{bookingData?.shipperCountry}
                  </p>
                </div>
                <div className="consigneeInfo borderBottom">
                  <p className="textTitle">Consignee:</p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.buyerBank}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.notifyBankAddr}
                  </p>
                  <p>
                    {" "}
                    {bookingData?.objPurchase?.[0]?.infoType === "lc"
                      ? "A/C "
                      : ""}
                    {bookingData?.consigneeName}
                  </p>
                  <p>{bookingData?.consigneeAddress}</p>
                  {/* <p>{bookingData?.consigneeContactPerson}</p> */}
                  <p>{bookingData?.consigneeContact}</p>
                  <p>
                    {bookingData?.consigState}, {bookingData?.consigCountry}
                  </p>
                  <p>{bookingData?.consigneeEmail}</p>
                </div>
                <div className="notifyParty borderBottom">
                  <p className="textTitle">Notify Party:</p>
                  <p>{bookingData?.notifyPartyDtl1?.participantsName}</p>
                  <p>
                    {bookingData?.notifyPartyDtl1?.zipCode &&
                      `${bookingData?.notifyPartyDtl1?.zipCode}, `}
                    {bookingData?.notifyPartyDtl1?.state &&
                      `${bookingData?.notifyPartyDtl1?.state}, `}
                    {bookingData?.notifyPartyDtl1?.city &&
                      `${bookingData?.notifyPartyDtl1?.city}, `}
                    {bookingData?.notifyPartyDtl1?.country &&
                      `${bookingData?.notifyPartyDtl1?.country}, `}
                    {bookingData?.notifyPartyDtl1?.address}
                  </p>
                </div>
                <div className="preCarriageInfo borderBottom">
                  <div className="firstColumn">
                    <p className="textTitle">Pre-Carriage By:</p>
                    <p>{bookingData?.transportPlanning?.vesselName}</p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Place of Receipt:</p>
                    <p>{bookingData?.pickupPlace}</p>
                  </div>
                </div>
                <div className="oceanVesselInfo">
                  <div className="firstColumn">
                    <p className="textTitle">Ocean Vessel:</p>
                    <p>
                      {bookingData?.transportPlanning?.vesselName || ""} /{" "}
                      {bookingData?.transportPlanning?.voyagaNo || ""}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Port of Loading:</p>
                    <p> {bookingData?.portOfLoading}</p>
                  </div>
                </div>
              </div>
              <div className="rightSide">
                <div className="rightSideTop">
                  <div className="leftSide borderRight">
                    <p className="textTitle">Date of Issue:</p>
                    <p>
                      {bookingData?.createdAt &&
                        moment(bookingData?.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">B/L Number:</p>
                    <p>{bookingData?.hblnumber}</p>
                  </div>
                </div>
                <div className="rightSideMiddleContent">
                  <img
                    src={logisticsLogo}
                    alt=""
                    style={{ height: 100, width: 150, objectFit: "contain" }}
                  />
                  <h1>Akij Logistics Limited</h1>
                  <h3>Bir Uttam Mir Shawkat Sarak, Dhaka 1208</h3>
                </div>
                <div className="rightSideBottom">
                  <p className="textTitle" style={{ paddingBottom: 5 }}>
                    For delivery of goods please apply to:
                  </p>
                  <div style={{ paddingLeft: 5 }}>
                    <p>
                      {bookingData?.freightAgentReference} <br />
                    </p>
                    {bookingData?.deliveryAgentDtl?.zipCode &&
                      `${bookingData?.deliveryAgentDtl?.zipCode}, `}
                    {bookingData?.deliveryAgentDtl?.state &&
                      `${bookingData?.deliveryAgentDtl?.state}, `}
                    {bookingData?.deliveryAgentDtl?.city &&
                      `${bookingData?.deliveryAgentDtl?.city}, `}
                    {bookingData?.deliveryAgentDtl?.country &&
                      `${bookingData?.deliveryAgentDtl?.country}, `}{" "}
                    {bookingData?.deliveryAgentDtl?.address &&
                      `${bookingData?.deliveryAgentDtl?.address}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="middle">
              <div className="firstRow borderBottom">
                <div className="firstColumn borderRight">
                  <p className="textTitle">Port of Discharge:</p>
                  <p>{bookingData?.portOfDischarge}</p>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p className="textTitle">Final Destination:</p>
                    <p>{bookingData?.finalDestinationAddress}</p>
                  </div>
                  <div className="item borderRight">
                    <p className="textTitle">Freight payable at</p>
                  </div>
                </div>
                <div className="thirdColumn">
                  <p className="textTitle">Number of Original B/L:</p>
                </div>
              </div>
              <div className="secondRow borderBottom textTitle">
                <div className="firstColumn borderRight">
                  <p>Marks &amp; Numbers</p>
                  <p>Container &amp; Seal Numbers</p>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p>No. of Packages</p>
                  </div>
                  <div className="item borderRight">
                    <p>Description of Packages and Goods</p>
                    <p>Particularly Furnished by Shipper</p>
                  </div>
                </div>
                <div className="thirdColumn">
                  <div className="item borderRight">
                    <p>Gross weight</p>
                    <p>KG</p>
                  </div>
                  <div className="item">
                    <p>Measurement</p>
                    <p>CBM</p>
                  </div>
                </div>
              </div>
              <div className="thirdRow borderBottom">
                <div className="firstColumn borderRight">
                  <div
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    {isPrintView ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: htmlContent?.marks || "",
                          }}
                        ></div>
                      </>
                    ) : (
                      <ReactQuill
                        value={htmlContent?.marks || ""}
                        onChange={(value) => {
                          changeHandelar &&
                            changeHandelar({
                              key: "marks",
                              value,
                            });
                        }}
                        modules={{
                          toolbar: false,
                        }}
                        style={{
                          padding: 0,
                          margin: 0,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p>
                      {/* totalNumberOfPackages sum */}
                      {totalNumberOfPackages}
                      <br />
                      Cartons
                    </p>
                  </div>
                  <div
                    className="item borderRight"
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    <p>
                      {" "}
                      {totalNumberOfPackages} Cartons (
                      {totalNumberOfPackages &&
                        convertNumberToWords(totalNumberOfPackages)}{" "}
                      Cartons only)
                    </p>
                    <p>Description Of Goods:</p>

                    {bookingData?.rowsData?.map((item, index) => {
                      return (
                        <>
                          <p>{item?.descriptionOfGoods}</p>
                          <p>
                            Po No:{" "}
                            {item?.dimensionRow?.map((i, index) => {
                              return (
                                (i?.poNumber || "") +
                                (index < item?.dimensionRow?.length - 1
                                  ? ","
                                  : "")
                              );
                            })}
                          </p>
                          <p>
                            Color:{" "}
                            {item?.dimensionRow?.map((i, index) => {
                              return (
                                (i?.color || "") +
                                (index < item?.dimensionRow?.length - 1
                                  ? ","
                                  : "")
                              );
                            })}
                          </p>
                          <p>
                            H.S Code:{" "}
                            {(item?.hsCode || "") +
                              (index < bookingData?.rowsData?.length - 1
                                ? ","
                                : "")}
                          </p>
                          <br />
                        </>
                      );
                    })}

                    <br />
                    <p>
                      Invoice No: {bookingData?.refInvoiceNo} :{" "}
                      {bookingData?.refInvoiceDate &&
                        `${moment(bookingData?.refInvoiceDate).format(
                          "DD-MM-YYYY"
                        )}`}
                    </p>
                    <p>
                      {bookingData?.infoType === "lc"
                        ? "LC No"
                        : bookingData?.infoType === "tt"
                        ? "TT No"
                        : "S/C No"}
                      :{" "}
                      {bookingData?.objPurchase?.map((item, index) => {
                        return `${item?.lcnumber || ""} : ${item?.lcdate &&
                          `${moment(item?.lcdate).format("DD-MM-YYYY")}`}${
                          index < bookingData?.objPurchase?.length - 1
                            ? ","
                            : ""
                        }`;
                      })}
                    </p>
                    <p>
                      Exp No:
                      {bookingData?.expOrCnfNumber || ""} :{" "}
                      {bookingData?.expOrCnfDate &&
                        `${moment(bookingData?.expOrCnfDate).format(
                          "DD-MM-YYYY"
                        )}`}
                    </p>
                    <p>Stuffing mode: {bookingData?.modeOfStuffings}</p>
                    <br />
                    <table
                      style={{
                        width: "250px",
                      }}
                    >
                      <>
                        <tr>
                          <td>Conainer No</td>
                          <td>Seal No</td>
                          <td>Size</td>
                          <td>Mode</td>
                        </tr>
                        {bookingData?.transportPlanning?.containerDesc?.map(
                          (i, index) => {
                            return (
                              <tr key={Math.random()}>
                                <td>{i?.containerNumber}</td>
                                <td>{i?.sealNumber}</td>
                                <td>{i?.size}</td>
                                <td>
                                  {bookingData?.modeOfStuffingSeaName || ""}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    </table>
                  </div>
                </div>
                <div className="thirdColumn">
                  <div className="item borderRight">
                    <p>
                      {/* totalGrossWeightKG sum */}
                      {bookingData?.rowsData?.reduce((acc, item) => {
                        return acc + (+item?.totalGrossWeightKG || 0);
                      }, 0)}{" "}
                      KGS
                    </p>
                  </div>
                  <div
                    className="item"
                    style={{
                      position: "relative",
                    }}
                  >
                    <p>
                      {/* totalVolumeCBM sum */}
                      {bookingData?.rowsData?.reduce((acc, item) => {
                        return acc + (+item?.totalVolumeCBM || 0);
                      }, 0)}{" "}
                      CBM
                    </p>
                    <div
                      style={{
                        fontWeight: 700,
                        position: "absolute",
                        top: "79px",
                        left: "-67px",
                        zIndex: 9,
                        fontSize: "13px",
                      }}
                    >
                      <p>Shipped On Board</p>
                      <p>
                        Date:{" "}
                        {bookingData?.transportPlanning
                          ?.estimatedTimeOfDepart &&
                          moment(
                            bookingData?.transportPlanning
                              ?.estimatedTimeOfDepart
                          ).format("DD-MM-YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="bottomLeft">
                <div className="bottomFirstColumn">
                  <div className="firstColumn">
                    <p className="textTitle text-center">
                      Freight and Disbursment
                    </p>
                    <h3
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        minHeight: "200px",
                        borderBottom: "1px solid #000",
                      }}
                    >
                      {" "}
                      FREIGHT{" "}
                      {["exw"].includes(bookingData?.incoterms) &&
                        "COLLECT EXW"}
                      {["fca", "fob"].includes(bookingData?.incoterms) &&
                        "COLLECT"}
                      {["cif", "cpt", "cfr"].includes(bookingData?.incoterms) &&
                        "PREPAID"}
                      {["dap", "ddp", "ddu"].includes(bookingData?.incoterms) &&
                        "COLLECT DAP/DDP/DDU"}
                      {["other"].includes(bookingData?.incoterms) && "COLLECT"}
                    </h3>
                    <h3>CARGO SHOULD BE</h3>
                  </div>
                </div>
                {/* <div className="bottomSecondColumn borderBottom">
          <div className="firstColumn">
            <p
              className="textTitle"
              style={{
                fontSize: '14px',
                padding: '10px',
              }}
            >
              TOTAL PREPAID
            </p>
          </div>
        </div>
        <div className="bottomThirdColumn">
          <div className="firstColumn">
            <p
              className="textTitle"
              style={{
                fontSize: '14px',
                padding: '10px',
              }}
            >
              TOTAL COLLECT
            </p>
          </div>
        </div> */}
              </div>
              <div className="bottomRight">
                <div
                  className="thirdColumn"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="textTitle">
                      Received by Akij Logistics Limited. for shipment by ocean
                      vessel, between port of loading and port of discharge, and
                      for arrangement or procurement of pre-carriage from place
                      of acceptance and/or on carriage to place of delivery as
                      indicated above: the goods as specified above in apparent
                      good order and condition unless otherwise stated. The
                      goods to be delivered at the above mentioned port of
                      discharge or place of delivery whichever applies. Subject
                      to Akij Logistics Limited. terms contained on the reverse
                      side hereof, to which the Shipper agrees by accepting this
                      Bill of Lading. In witness whereof three (3) original
                      Bills of Lading have been signed, if not otherwise stated
                      above, one of which being accomplished the other(s) to be
                      void.
                    </p>
                    <br />
                    <p
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Dhaka, Bangladesh
                    </p>
                  </div>
                  <p
                    style={{
                      borderTop: "1px solid",
                      padding: "0px 20px",
                      display: "flex",
                      justifyContent: "end",
                      width: "240px",
                      fontSize: "14px",
                      marginBottom: "23px",
                      alignSelf: "flex-end",
                      marginRight: "20px",
                    }}
                  >
                    Stamp and authorized signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {footerText}
        </p>
      </div>
    </>
  );
};
