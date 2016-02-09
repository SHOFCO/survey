window.pages = [{"questions": [{"label": "Survey Location", "type": "options", "options": ["Mathare", "Kibera"], "subs": [{"other": true, "type": "options", "unskippable": true, "when": "($parent) == 'Mathare'", "options": ["Mabatini", "Bondeni", "4B", "3A", "3C", "Mradi", "T-Area", "Number 10", "4A", "Baraka", "Adhara", "H-Area", "F-Area", "Ganja", "G-Area"], "label": "Mathare Village"}, {"other": true, "type": "options", "unskippable": true, "when": "($parent) == 'Kibera'", "options": ["Mashimoni", "Lindi", "Kianda", "Kisumu Ndongo", "Silanga", "Raila", "Makongeni", "Gatwekera"], "label": "Kibera Village"}]}, {"label": "Language interview conducted in", "unskippable": true, "type": "options", "other": true, "options": ["English", "Kiswahili", "Luo"]}], "title": "SHOFCO Kibera Baseline Survey Form"}, {"static": "Good morning/afternoon. My name is ($user). I am from Shining Hope for Communities,\nan organization that offers health and education programs and services for Kibera and\nMathare residents.  We are conducting a survey of the people who live in this\ncommunity and therefore your household has been randomly selected to participate\nin this study.\n\nI will ask you questions about the people living in your house: their health,\nrelationships, work, education, their use of health and social services during the\npast year.\n\nYour participation to this survey is completely voluntary and your answers will remain\nconfidential. If you have any questions or complaints about this interview please\ncontact the Research Manager, Solomon Odero at 0707080734\n", "title": "Informed Consent"}, {"numbered": true, "questions": [{"type": "yesNo", "unskippable": true, "endSurveyWhen": "($value) == 'Yes'", "subs": [{"type": "checkboxes", "when": "($parent) == 'Yes'", "options": ["JJJ Clinic", "SHOFCO Clean Water Kiosk", "Kibera School for Girls", "GS&L", "SHOFCO Urban Movement (SUN)", "Youth Programs", "SWEP", "Gender Department", "Cyber Caf\u00e9", "Community Library", "SHOFCO Daycare"], "label": "Which SHOFCO Programs have you and/or your children participated in/utilized?"}, {"when": "($parent) == 'Yes'", "type": "yesNo", "label": "Have you ever read the Ghetto Mirror?"}], "label": "Have you ever participated in SHOFCO services (Kibera School for Girls, JJJ Clinic, SHOFCO Clean Water, SHOFCO Community centers)?"}, {"type": "yesNo", "unskippable": true, "endSurveyWhen": "($value) == 'No'", "label": "Are you [any of present household members] interested in participating in this survey?"}, {"endSurveyWhen": "($value) == 0", "subs": [{"max": "($parent)", "when": "($parent) > 1", "type": "random", "label": "Assign each person a number, starting with 1. Choose the below number as your participant.", "min": 1}], "instructions": "Ask for IDs or DOB.\n", "unskippable": true, "type": "number", "label": "How many participating household members are above 18?"}, {"type": "yesNo", "unskippable": true, "endSurveyWhen": "($value) == 'No'", "label": "Does the respondent agree to participate?"}, {"unskippable": true, "type": "signature", "label": "I certify that I have read the above consent procedure to the participant"}], "title": "Preliminary Questions"}, {"static": "1. All the italic writings and bold are instructions for the interviewer to check, don't read them aloud.\n\n2. All bold, not italic are to be read out for the respondents.\n\n3. If the respondent is not ready to respond or uncomfortable with the question, skip the question.\n\n4. If the respondent's answer is not included in the answer choices, please include their answer in the \u201cOther\u201d answer space.\n", "title": "General Instructions For Interviewer"}, {"static": "First I'd like to ask you some general questions about you and your family.", "questions": [{"type": "options", "label": "Gender of Respondent", "referenceAs": "gender", "options": ["Male", "Female"], "instructions": "(Observe)"}, {"max": 100, "label": "How old are you? (number of years)", "type": "number", "min": 18}, {"type": "options", "referenceAs": "maritalStatus", "options": ["Married", "Not married", "Divorced", "Widowed", "Separated"], "label": "What is your marital status?"}, {"type": "yesNo", "referenceAs": "hasChildren", "subs": [{"max": 20, "when": "($parent) == 'Yes'", "type": "number", "label": "How many children do you have?", "min": 1}], "label": "Do you have children?"}, {"type": "number", "label": "How many siblings do you have?"}, {"type": "yesNo", "label": "Is your mother living?"}, {"type": "yesNo", "label": "Is your father living?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'No'", "type": "number", "label": "What year did you move to Kibera?"}], "label": "Were you born in Kibera?"}], "title": "Demographic Information"}, {"static": "Complete household matrix for all current household members (DO NOT RECORD NAMES).\n", "questions": [{"type": "person", "relationship": "Respondent", "label": "Respondent"}, {"type": "person", "relationship": "Spouse", "label": "Spouse"}, {"type": "person", "referenceAs": "person1", "label": "Person 1"}, {"when": "!(person1:skipped)", "label": "Person 2", "referenceAs": "person2", "type": "person"}, {"when": "!(person2:skipped)", "label": "Person 3", "referenceAs": "person3", "type": "person"}, {"when": "!(person3:skipped)", "label": "Person 4", "referenceAs": "person4", "type": "person"}, {"when": "!(person4:skipped)", "label": "Person 5", "referenceAs": "person5", "type": "person"}, {"when": "!(person5:skipped)", "label": "Person 6", "referenceAs": "person6", "type": "person"}, {"when": "!(person6:skipped)", "label": "Person 7", "referenceAs": "person7", "type": "person"}, {"when": "!(person7:skipped)", "label": "Person 8", "referenceAs": "person8", "type": "person"}, {"when": "!(person8:skipped)", "label": "Person 9", "referenceAs": "person9", "type": "person"}, {"type": "person", "when": "!(person9:skipped)", "label": "Person 10"}], "title": "Household Chart"}, {"static": "Now I would like to ask you some questions about your household, your\nmonthly expenses and income.\n", "questions": [{"keyLabel": "Item", "keys": ["Radio", "Television", "Sofa", "Chairs", "Table", "Mobile phone", "Mattress"], "valueLabel": "Total in the household", "valueType": "number", "instructions": "Answer should be number of Items owned (If the household owns 2 Radios then 2 should written in\nthe \u201cTotal in the household\u201d column. If they do not own an item then 0 should be written in the\n\u201cTotal in the household\u201d column.\n", "type": "table", "label": "How many of the following items does your household currently own?"}, {"forceChoice": true, "type": "checkboxes", "options": ["Cutlery", "Gum Boots", "Jacket"], "label": "Do you have enough of the following items for every member of the household?"}, {"keyLabel": "Expense", "keys": ["Food", "Water", "Toilet Use", "Healthcare (Medical bills)", "Transportation", "Cell Phone Credit / Expense", "Fuel (e.g. Charcoal, Kerosene, Gas, Firewood)", "Rent", "Electricity"], "valueLabel": "Amount of money household spent in Ksh", "valueType": "number", "instructions": "If the respondent is unsure of how much they spend, probe further (e.g. How many times in a week\ndo you purchase water and how much do you usually spend when you purchase water? From there you can\nestimate monthly use. Confirm that the monthly amount makes sense to the respondent.\n", "type": "table", "label": "In the last month, how much did you spend on:"}, {"rows": 4, "type": "text", "label": "How do you cover your monthly expenses (include all sources of incomes, including loans, money borrowed, etc)?", "instructions": "Probe for more answers, especially if their listed income is much less than their reported expenses.\n"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'Yes'", "type": "number", "label": "How much do you save generally per month?"}, {"when": "($parent) == 'No'", "rows": 3, "type": "text", "label": "Why are you not able to save?"}], "label": "Do you have savings?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'No'", "rows": 3, "type": "text", "label": "Where do you keep your money?"}], "label": "Do you have a bank account?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'No'", "type": "yesNo", "subs": [{"when": "($parent) == 'No'", "other": true, "type": "options", "options": ["Lack of money", "Short time", "Spouse doesn't approve"], "label": "What is preventing you from getting the necessary training?"}, {"when": "($parent) == 'Yes'", "rows": 3, "type": "text", "label": "What is preventing you from getting a job?"}], "label": "Do you think you have the training necessary for you to find employment that you want?"}], "label": "Are you currently employed?"}], "title": "Economic"}, {"questions": [{"label": "How many rooms are in your house?", "type": "number", "instructions": "Interviewer can answer by observation"}, {"label": "How many people live in your house?", "type": "number", "instructions": "(If the number given doesn't match the family chart, please ask clarifying questions)"}, {"label": "What source of energy do you use to cook?", "other": true, "type": "checkboxes", "options": ["Wood", "Carbon / charcoal", "Electricity / gas", "Kerosene"], "instructions": "Check all that apply"}, {"label": "Where do you cook?", "other": true, "type": "checkboxes", "options": ["Outside", "Inside house in a room with a window", "Inside house in an enclosed space with no window", "In separate kitchen room with window", "In separate kitchen room without window"], "instructions": "Check all that apply"}, {"label": "How do you dispose of your garbage?", "other": true, "type": "options", "options": ["Throw onto your own land/lot", "Thrown into a Drain or ditch", "Left in the open", "Burned", "Paid people to Pick-up"], "instructions": "Check all that apply"}], "title": "Economic"}, {"static": "Now I'd like to ask you some questions about your life and health. Some of these\nquestions are very personal. I would like to remind you that all of your answers will\nbe kept completely anonymous.\n", "questions": [{"type": "options", "options": ["This week", "Last Week", "This Month", "In the past 2 months", "In the past 6 months", "In the past year", "More than a year ago", "More than 2 years ago"], "label": "When was the last time you or someone in your family needed medical care?"}, {"rows": 2, "type": "text", "label": "What was the reason?"}, {"other": true, "type": "options", "options": ["CDC", "MSF", "JJJ (SHOFCO) Clinic", "AMREF", "Langata District Hospital", "St. Mary's Hospital", "Mbagathi District Hospital"], "label": "Where do you usually receive medical care?"}, {"label": "How many times in the past 3 months has someone in your household been treated for diarrhea?", "type": "options", "options": ["Zero", "Once", "Twice", "Thrice", "Four times", "Five times", "More than Five times"], "subs": [{"when": "($parent) != 'Zero'", "other": true, "type": "checkboxes", "options": ["Purchased Oral rehydration salts from Chemist", "Purchased Zinc from a Chemist", "Purchased Antibiotics from the Chemist", "Went to clinic or hospital", "Changed their food/water", "Waited and it went away on its own"], "label": "What treatment did you use (Check all that apply)"}, {"when": "($parent) != 'Zero'", "rows": 3, "type": "text", "label": "To your knowledge, state the main causes of diarrhea"}]}, {"type": "yesNo", "label": "Do you know anyone living with HIV?"}, {"type": "options", "options": ["Yes", "No", "Not Sure"], "label": "If a member of your family became infected with HIV, would you want to keep it a secret?"}, {"type": "options", "options": ["Yes", "No", "Not Sure"], "label": "Do you think those who are HIV+ should declare their status to family members or public?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'Yes'", "type": "options", "options": ["Past Month", "Past 3 months", "Past 6 months", "Past year", "Past 2 years", "More than 2 years ago", "Can't remember"], "label": "When was the last time you were tested?"}], "label": "Have you ever been tested for HIV?"}], "title": "Health & Medical Care"}, {"static": "Now I'd like to ask you some questions about you and your household's access to water and sanitation.", "questions": [{"other": true, "type": "options", "options": ["Tap", "River", "Water Vendor"], "label": "Where do you get your drinking water?"}, {"type": "yesNo", "subs": [{"type": "options", "other": true, "when": "($parent) == 'No'", "options": ["Tap", "River", "Water Vendor"], "label": "Where do you get your water for other purposes?"}], "label": "Do you use the same water source for drinking as you do for other purposes, such as cooking or washing?"}, {"type": "options", "options": ["Less than 5 minutes", "5-10 minutes", "10-30 minutes", "30-60 minutes", "More than an hour"], "label": "How long does it take you to get to your drinking water source, get water, and come back?"}, {"label": "How often do you treat your drinking water?", "type": "options", "options": ["Never", "Rarely", "Occasionally", "Often", "Always"], "subs": [{"when": "($parent) != 'Never'", "other": true, "type": "checkboxes", "options": ["Boiling", "Chlorine", "SODIS", "Filtration"], "label": "What water treatment methods do you use?"}]}, {"type": "options", "options": ["Daily", "Twice a week", "Weekly", "Monthly", "Never"], "label": "How often do you clean your jerycan with soap and water?"}, {"other": true, "type": "checkboxes", "options": ["Plastic Jerrican", "Open plastic pail or bowl", "Traditional  clay pot", "Plastic Dispenser Container"], "label": "What type of container do you use to store your drinking water?"}, {"type": "yesNo", "label": "Do you store your drinking water in a container with a lid?"}, {"type": "options", "options": ["Half a day", "1 Day", "2 Days", "3 Days", "4 or more days"], "label": "On average, how long would you store drinking water?"}, {"label": "What kind of toilet facility do members of your household use?", "noneOfTheAbove": true, "type": "checkboxes", "other": true, "options": ["Pit latrine with concrete slab", "Pit latrine without concrete slab", "Biolatrine", "Bucket"]}, {"type": "options", "options": ["Very clean", "Clean", "Just okay", "Dirty", "Very Dirty"], "label": "How would you rate the average cleanliness of your toilet facility?"}, {"other": true, "type": "options", "options": ["Child used Toilet/Latrine", "Put into toilet/latrine", "Put/Rinsed into drain or ditch", "Thrown into Garbage", "Left in Open", "No children under 5 in house"], "label": "If there is a child under 5 in the house: How do you dispose the stool for your young ones under the age of 5?"}, {"other": true, "type": "checkboxes", "options": ["After work", "Before/After eating", "After using the bathroom", "Before cooking", "After helping infants use the bathroom"], "label": "When do members of your household wash their hands (check all that apply)?"}, {"other": true, "type": "options", "options": ["With a cloth", "With water", "With soap and water"], "label": "What method do members of your household most often use to wash their hands?"}], "title": "Water & Sanitation"}, {"when": "(gender) == 'Female'", "questions": [{"referenceAs": "hasGivenBirth", "type": "yesNo", "label": "Have you ever given birth?"}], "title": "Female respondents"}, {"when": "(hasGivenBirth) == 'Yes'", "questions": [{"type": "number", "label": "How many times have you given birth?"}, {"type": "number", "label": "How many of your children are currently living?"}, {"type": "yesNo", "label": "Are you currently expecting a baby?"}, {"type": "number", "label": "How old were you the first time you gave birth?"}, {"type": "options", "options": ["Before I intended", "When I intended", "After I intended", "I did not intend to get pregnant", "I don't know"], "label": "Would you say that your last or current pregnancy began..."}, {"label": "During your last/current pregnancy, when did you first visit a medical facility for your pregnancy?", "type": "options", "options": ["0-2 months", "2-4 months", "4-6 months", "6 -8 months", "8+ months", "Not at all"], "subs": [{"when": "($parent) != 'Not at all'", "type": "options", "options": ["1-2 times", "3-4 times", "5-6 times", "7+ times"], "label": "How many times during your last pregnancy did you visit a medical facility (prior to giving birth)?"}]}, {"other": true, "type": "options", "options": ["Government Hospital", "Private Medical Centre", "Informal Medical Centre", "In my house", "In the house of a relative/friend"], "label": "Where did you give birth to your last child?"}], "title": "Female respondents with children"}, {"static": "Now I would like to talk about family planning - the various ways or methods that a couple can use to delay or avoid a pregnancy.", "when": "(gender) == 'Female'", "questions": [{"options": ["Pills/Tablets", "Injectables", "Implants", "IUD", "Diaphragm/Foam/Jelly", "Female sterilization", "Male sterilization", "Condoms", "\"Safe days\"", "Withdrawal", "Herbs"], "noneOfTheAbove": true, "instructions": "Ask respondent to verbally list all the family planning methods they know and check all that apply", "type": "checkboxes", "other": true, "label": "What family planning methods do you know about?"}, {"subs": [{"when": "($parent:countCheckboxes) == 0", "rows": 3, "type": "text", "label": "How do you prevent unwanted pregnancies?"}], "referenceAs": "familyPlanningMethods", "label": "Have you EVER used any of the following to prevent or delay pregnancy?", "other": true, "forceChoice": true, "type": "checkboxes", "options": ["Pills / Tablets", "Injectables", "Implants", "IUD", "Diaphragm / Foam / Jelly", "Female sterilization", "Male sterilization", "Condoms", "\"Safe days\"", "Withdrawal", "Herbs"], "instructions": "Read options out loud"}], "title": "All Female Respondents"}, {"when": "(familyPlanningMethods:countCheckboxes) > 0", "questions": [{"label": "Are you CURRENTLY using any of the following to prevent or delay pregnancy?", "noneOfTheAbove": true, "type": "checkboxes", "other": true, "options": ["Pills / Tablets", "Injectables", "Implants", "IUD", "Diaphragm / Foam / Jelly", "Female sterilization", "Male sterilization", "Condoms", "\"Safe days\"", "Withdrawal", "Herbs"]}, {"other": true, "type": "checkboxes", "options": ["Not ready to have children", "To provide space/intervals between children", "Can't/Couldn't afford another child"], "label": "Why do/did you want to delay or avoid getting pregnant (check all that apply)?"}, {"other": true, "type": "options", "options": ["Mainly respondent's decision", "Mainly husband/partner", "Joint decision with husband/partner"], "label": "Would you say that using contraceptive is mainly your decision, mainly your husband's/partner's decision, or did you both decide together? (DHS)"}, {"when": "(maritalStatus) == 'Married'", "label": "Does your husband/partner know that you are using family planning? (DHS)", "type": "options", "options": ["Yes", "No", "Don't Know"], "subs": [{"when": "($parent) == 'Yes'", "type": "options", "options": ["Approves", "Disapproves", "I don't know his opinion"], "label": "Does your husband/partner approve of you using family planning?"}]}], "title": "Female Respondents That Have Used Family Planning Only"}, {"static": "When two people live together, they usually share good and bad moments.\nI would now like to ask you some questions about your current and past relationships.\nIf anyone interrupts us I will change the topic of conversation. I would again like to\nassure you that your answers will be kept in secret, and that you do not have to answer\nquestions that you do not want to. May I continue?\n\nDoes / did your (current / last) husband / partner ever:\n", "when": "(gender) == 'Female'", "questions": [{"label": "Push you, shake you, or throw something at you?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Slap you?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Twist your arm or pull your hair?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Punch you with his fist or with something that could hurt you?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Kick you or drag you or beat you up?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Try to choke you or burn you on purpose?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Threaten or attack you with a knife, gun, or any other weapon?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Physically force you to have sexual intercourse even when you did not want to?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Force you to perform any sexual acts you did not want to?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Say or do something to humiliate you in front of others?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Threaten to hurt or harm you or someone close to you?", "type": "yesNo", "specialSub": "frequency"}, {"label": "Insult you or make you feel bad about yourself?", "type": "yesNo", "specialSub": "frequency"}], "title": "Domestic Violence"}, {"static": "Now I would like to talk about family planning - the various ways or methods that a\ncouple can use to delay or avoid a pregnancy.\n", "when": "(gender) == 'Male'", "questions": [{"when": "(maritalStatus) == 'Married'", "type": "options", "options": ["Yes", "No", "Don't Know"], "label": "Does your wife/partner use family planning?"}, {"type": "options", "options": ["Approve", "Disapprove", "Don't know"], "label": "Do you/Would you approve or disapprove of your wife/partner using family planning to prevent pregnancy?"}, {"other": true, "type": "options", "options": ["Mainly respondent", "Mainly wife / partner", "Joint decision"], "label": "Would you say that your wife/partner use of family planning is/should be mainly your decision, mainly your wife's/partner's decision, or a joint decision?"}], "title": "Male Only Section"}, {"when": "(maritalStatus) == 'Married'", "questions": [{"other": true, "type": "options", "options": ["Mainly You (Respondent)", "Mainly your Husband/Wife", "Both You & Your Husband/Wife"], "label": "Who usually decides how your Spouse's (husband or wife's) money will be used?"}, {"other": true, "type": "options", "options": ["Myself (Respondent)", "My Husband/Wife", "My Husband/Wife and I decide together"], "label": "Who usually decides how your (respondent's) money will be used?"}, {"when": "(hasChildren) == 'Yes'", "other": true, "type": "options", "options": ["Myself (Respondent)", "Your Husband/Wife", "Both You & Your Husband/Wife", "Your Mother", "Your Father"], "label": "Who in your family has the most control over decisions involving the education of your children?"}], "title": "For Married Respondents Only"}, {"questions": [{"referenceAs": "householdHasChildren", "type": "yesNo", "label": "Are there any children in the household?"}], "title": "Households with children"}, {"when": "(householdHasChildren) == 'Yes'", "static": "All adults use certain ways to teach children the right behavior or to address a behavior problem.\nI will read various methods that are used and I want you to tell me if you or anyone else in your\nhousehold has used this method with your child/children in the past month?\n", "questions": [{"type": "yesNo", "label": "Took away privileges, forbid something the child liked or did not allow him/her to leave house."}, {"type": "yesNo", "label": "Explained why something (the behavior) was wrong."}, {"type": "yesNo", "label": "Shook him/her."}, {"type": "yesNo", "label": "Shouted, yelled at, or screamed at him/her."}, {"type": "yesNo", "label": "Hit, or slapped him/her with bare hand."}, {"type": "yesNo", "label": "Hit him/her with something like a belt, hairbrush, stick or other hard object."}, {"type": "yesNo", "label": "Called him/her dumb, lazy or another name like that."}, {"type": "yesNo", "label": "Beat him/her up repeatedly with an object (hit over and over as hard as one could)."}, {"type": "options", "options": ["Yes", "No", "Don't know"], "label": "Do you believe that in order to bring up (raise, educate) your child/Children properly you need to physically punish him/her?"}], "title": "Child Discipline"}, {"questions": [{"label": "What is your ideal family size in terms of number of children?", "other": true, "type": "options", "options": ["Zero", "One", "Two", "Three", "Four", "Five", "Six+"], "instructions": "Probing Questions: How many total children would you like to have?\nIf they already have children, would they like to have more and If YES, how many?\n"}], "title": "Family Roles / Attitudes"}, {"static": "Explain what QOL is to respondents. QOL refers to the general well-being of a person,\ndefined in terms of health and happiness, rather than how much money they have.\n", "questions": [{"type": "options", "options": ["Very poor", "Poor", "Neither poor nor good", "Good", "Very good"], "label": "How would you rate your quality of life?"}, {"label": "Do you and your family feel safe in your home and your community?", "type": "options", "options": ["Always", "Most of the time", "Sometimes", "Rarely", "Never"], "instructions": "(Read answers out loud)"}, {"label": "How do you expect your economic situation to be five years from now?", "type": "options", "options": ["The same", "Better", "Much better", "Worse", "Don't know"], "instructions": "(Read answers out loud)"}, {"label": "Do you have enough money to meet your needs?", "type": "options", "options": ["Not at all", "Some of the time", "Most of the time", "Always"], "instructions": "(Read answers out loud)"}, {"rows": 4, "type": "text", "label": "82. What are your greatest needs?"}], "title": "General Quality of Life (QOL)"}, {"questions": [{"type": "options", "options": ["Yes", "No", "Yes, but it has been more than a year"], "label": "Have you or a family member been the victim of an act of violence in the last year?"}, {"label": "If you or your relative were a victim of rape, how confident are you that the Kenyan legal system (e.g. police and courts) would take the necessary action to arrest, prosecute and punish the rapist?", "type": "options", "options": ["Not at all", "A little", "Somehow", "Very much", "Extremely"], "instructions": "(Read answers out loud)"}, {"type": "options", "options": ["I wouldn't seek help", "My Church/Mosque", "NGO/CBO GBV services", "Clinic/Hospital", "Relatives", "Neighbor/Friend", "Police", "Chief", "I don't know"], "label": "If you or your relative were a victim of rape, who would you turn to for help?"}, {"type": "options", "options": ["I wouldn't seek help", "My Church/Mosque", "NGO/CBO GBV services", "Local Clinic/Hospital", "Relatives", "Neighbor/Friend", "Police", "Chief", "I don't know"], "label": "If you or your relative were a victim of domestic violence, who would you turn to for help?"}], "title": "Community Violence"}, {"static": "Now I\u2019m going to read you a few statements about Kibera / Maathare. Please tell me if you agree or disagree with each.", "questions": [{"type": "options", "options": ["Agree", "Disagree"], "label": "Boy children are more valued in this community than girl children."}, {"type": "options", "options": ["Agree", "Disagree"], "label": "In this community, children being raped is a serious problem."}, {"type": "options", "options": ["Agree", "Disagree"], "label": "In this community, girls and boys have an equal chance of a good future."}], "title": "Community attitudes"}, {"static": "In Kibera and elsewhere, people have different ideas about families and what is\nacceptable behavior from men and women in the home. I am going to read you a list of\nstatements, and I would like you to tell me whether you generally agree or disagree\nwith the statement. There are no right or wrong answers.\n", "questions": [{"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "I think people should be treated the same whether they are male or female"}], "title": "Gender Attitudes / Beliefs"}, {"static": "In your opinion, a man has good reason to hit his wife if: (DHS)\n", "questions": [{"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "If she leaves the house without telling him? (DHS)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "She neglects the children? (DHS)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "If she argues with him? (DHS)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "She refuses to have sexual relations with him? (DHS & GC)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "If she burns the food? (DHS)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "She is unfaithful? (GC)"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A woman should tolerate violence to keep her family together"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "If someone insults a man, he should defend his reputation with force if he has to."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A man using violence against his wife is a private matter that shouldn't be discussed outside the couple"}], "title": "Household Violence"}, {"questions": [{"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Men are always ready to have sex."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Men need sex more than women do."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A man needs other women even if things with his wife are fine."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Couples shouldn't talk about sex, they should just do it."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A woman should not initiate sex."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A woman who has sex before she marries does not deserve respect."}], "title": "Sexual Relationships"}, {"questions": [{"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Women who carry condoms on them are easy."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Men should be outraged if their wives ask them to use a condom."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "It is a woman's responsibility to avoid getting pregnant."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Only when a woman has a child, she is a real woman."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A real man produces a male child."}], "title": "Reproductive Health and Disease Prevention"}, {"questions": [{"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "Changing diapers, giving a bath, and feeding kids is the mother's responsibility"}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A woman's role is taking care of her home and family."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "The husband should decide to buy the major household items."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A man should have the final word about decisions in his home."}, {"type": "options", "options": ["Agree", "Partially agree", "Disagree", "Do Not Know", "Chose Not To Answer"], "label": "A woman should obey her husband in all things."}], "title": "Domestic Chores and Daily Life"}, {"static": "Thank you for answering these questions. To wrap up:", "questions": [{"type": "yesNo", "subs": [{"when": "($parent) == 'Yes'", "rows": 3, "type": "text", "label": "What have you heard?"}], "label": "Before today have you ever heard of SHOFCO?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'Yes'", "rows": 3, "type": "text", "label": "What is your opinion of it?"}], "label": "Have you ever heard of SUN (SHOFCO Urban Network)?"}, {"type": "yesNo", "subs": [{"when": "($parent) == 'Yes'", "rows": 3, "type": "text", "label": "What is your opinion of it?"}], "label": "Have you ever read the Ghetto Mirror?"}, {"rows": 3, "type": "text", "label": "What problem in the community do you think SHOFCO should most urgently address?"}, {"type": "options", "options": ["Very Bad", "Bad", "Neither Good or Bad", "Good", "Very Good"], "label": "How would you rate your experience of this interview?"}, {"rows": 3, "type": "text", "label": "Do you have any comments or concerns about the survey or any of the questions we asked?"}], "title": "Final Questions"}, {"title": "Post-Interview", "static": "Those are all the questions we have for you today. I would like to thank you very much\nfor helping us. I appreciate the time you have taken, and realize that these questions\nmay have been difficult for you to answer. Here is a list of SHOFCO services. These\nservices are accessible\u2014and are designed to serve people like you, so enjoy! In addition,\nif you have any questions or complaints about this interview please contact, please call\nSHOFCO\u2019s main number, 0707080734 and ask for Solomon/Johnson for more details.\n", "footer": true}];