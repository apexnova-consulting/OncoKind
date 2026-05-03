export type ResourceArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ResourceArticle = {
  slug: string;
  title: string;
  metaDescription: string;
  tags: string[];
  excerpt: string;
  relatedSlugs: string[];
  sections: ResourceArticleSection[];
};

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: 'what-is-a-pathology-report',
    title: 'What Is a Pathology Report? A Plain-English Guide for Families',
    metaDescription:
      'A pathology report can feel overwhelming. This guide explains what each section means so you can walk into your next appointment feeling informed and prepared.',
    tags: ['Understanding Reports'],
    excerpt:
      'A pathology report is one of the most important documents in cancer care, but it rarely feels written for the family reading it.',
    relatedSlugs: ['cancer-staging-explained', 'biomarkers-and-targeted-therapy', 'prepare-for-first-oncology-appointment'],
    sections: [
      {
        heading: 'Why this document matters',
        paragraphs: [
          'A pathology report is one of the most important documents in cancer care, but it rarely feels written for the family reading it. It is created by a pathologist, a doctor who studies tissue and cells under a microscope to identify what is happening in the body. After a biopsy or surgery, the pathologist examines the sample, describes what they see, and issues a report that becomes part of the medical record. That report often confirms whether cancer is present, what kind it is, and which details may shape treatment decisions.',
          'Families often expect a pathology report to read like a plain-language explanation. Instead, it usually reads like a technical record built for clinicians. That mismatch can make the first few minutes after reading it especially scary. The good news is that you do not need to decode every line perfectly on your own. What matters most is learning how to spot the pieces that help you prepare for your oncologist visit. Once you know what the document is trying to answer, it starts to feel less like a wall of terms and more like a map of the questions to ask next.',
        ],
      },
      {
        heading: 'Biopsy report versus surgical pathology report',
        paragraphs: [
          'A biopsy pathology report is based on a small sample of tissue. It often answers the first big question: is this cancer, and if so, what type does it appear to be? Because the sample is limited, a biopsy report may not tell the whole story. It can suggest the cancer subtype, grade, or biomarkers that need follow-up testing, but sometimes additional information only becomes clear after more tissue is examined.',
          'A surgical pathology report comes after a larger procedure, such as removing a tumor, part of an organ, or nearby lymph nodes. These reports usually offer more detail because the pathologist has more tissue to review. This is where terms like margins, lymphovascular invasion, tumor size, and lymph node involvement become especially important. In other words, a biopsy report often begins the diagnostic story, while a surgical pathology report fills in many of the details that affect stage and treatment planning.',
        ],
      },
      {
        heading: 'Common words that sound more frightening than they are',
        paragraphs: [
          'Pathology reports are full of unfamiliar words, and those words can feel emotionally heavy. “Adenocarcinoma” is one of them. It is not a grade or a stage by itself. It is a subtype of cancer that starts in gland-forming cells and can show up in organs like the lung, colon, pancreas, or breast. “Grade” describes how abnormal the cancer cells look compared with normal cells. In many cancers, a higher grade can suggest that the cells are more aggressive, but grade is only one piece of the picture.',
          '“Margins” refers to the edges of the tissue that was removed. If the report says “negative margins,” that is usually good news. It means no cancer was seen at the outer edge of the removed tissue, suggesting the tumor may have been fully removed in that area. “Lymphovascular invasion” means cancer cells were seen in small blood vessels or lymphatic channels near the tumor. That detail can matter because it gives doctors more information about how the cancer behaves, but it is not the same thing as saying the cancer has definitely spread everywhere.',
        ],
      },
      {
        heading: 'How to read the report without spiraling',
        paragraphs: [
          'A helpful way to approach a pathology report is to stop trying to read it like a novel and start reading it like a worksheet. Look first for the diagnosis line. That usually names the cancer type. Then look for any mention of grade, margins, lymph nodes, stage-related details, and biomarker testing. If you see a term you do not understand, write it down instead of trying to solve it immediately. The goal is not to become a pathologist overnight. The goal is to walk into the next appointment with organized questions.',
          'It can also help to remember that one report rarely tells the whole story of treatment. Treatment decisions are often made using the pathology report plus imaging, lab work, physical exam findings, biomarker tests, and the patient’s overall health. If a line feels alarming, it may still make more sense once your oncologist puts it in context. A single unfamiliar phrase is not the same thing as a final conclusion about what happens next.',
        ],
      },
      {
        heading: 'Questions worth asking after you receive the report',
        bullets: [
          'What is the exact cancer type and subtype named in this report?',
          'Do we know the grade, and how important is it in this cancer?',
          'If surgery was done, what do the margins show?',
          'Were any lymph nodes involved, and if so, how many?',
          'Are there biomarker or molecular tests we still need before treatment starts?',
          'What parts of this report matter most for the treatment plan right now?',
        ],
        paragraphs: [
          'Questions like these do two things at once: they help you understand the report, and they help your oncologist explain the practical next step. That is often the missing bridge between the medical document and the family’s real concern, which is not “What does this phrase mean in isolation?” but “What does this change about what happens next?”',
        ],
      },
      {
        heading: 'How to use the report before an oncology visit',
        paragraphs: [
          'Bring the report, either printed or on your phone. Highlight the sections you want explained. If there are terms you looked up online and now feel even more confused by, write those down too. The appointment will go better if you arrive with a short, focused list than if you try to memorize the whole report. A caregiver can help by organizing questions into buckets: diagnosis, staging, biomarker testing, treatment options, and what happens next.',
          'Most of all, remember that a pathology report is a starting point for a conversation, not a test you are supposed to pass. You are allowed to ask your doctor to slow down, repeat something, or explain it in different words. You are allowed to say, “Can you tell me what matters most here?” That is not falling behind. That is advocating well.',
        ],
      },
    ],
  },
  {
    slug: 'cancer-staging-explained',
    title: 'Cancer Staging Explained: What Stage I Through IV Really Means',
    metaDescription:
      "Cancer staging guides treatment decisions. Here's what each stage means in plain language — and why stage alone doesn't tell the whole story.",
    tags: ['Understanding Diagnosis'],
    excerpt:
      'When someone hears the word stage, it can sound like a final verdict, but staging is really a way of organizing information.',
    relatedSlugs: ['what-is-a-pathology-report', 'biomarkers-and-targeted-therapy', 'second-opinion-oncology'],
    sections: [
      {
        heading: 'What staging is actually for',
        paragraphs: [
          'When someone hears the word stage, it can sound like a final verdict. In reality, staging is a way of organizing information about how much cancer is present, where it is located, and whether it has spread. Doctors use stage to communicate clearly with one another, compare treatment approaches, and estimate which options might be appropriate. That means stage is important, but it is not the only thing that matters.',
          'Families often assume stage tells them everything they need to know. It does not. Two people can have the same stage and still need very different treatment plans. Cancer type, biomarkers, overall health, symptoms, age, location of disease, and the goal of treatment all matter too. So if you have heard a stage but still feel like you do not understand the plan, that does not mean you missed something. It usually means there is more context that still needs to be explained.',
        ],
      },
      {
        heading: 'The TNM system in plain English',
        paragraphs: [
          'Many solid tumors are staged using the TNM system. T stands for tumor: how large the main tumor is and whether it has grown into nearby tissue. N stands for nodes: whether nearby lymph nodes contain cancer. M stands for metastasis: whether the cancer has spread to distant parts of the body. Doctors combine those pieces into an overall stage, often Stage I through Stage IV.',
          'You do not need to memorize every TNM code. What matters is the idea behind it. T helps describe the local tumor. N helps describe regional spread. M helps describe distant spread. If you see something like T2N1M0, that is not meant to terrify you. It is shorthand. Your oncologist can translate it into a sentence such as, “The tumor is a certain size, some nearby nodes are involved, and there is no sign of distant spread.”',
        ],
      },
      {
        heading: 'What Stage I, II, III, and IV usually mean',
        paragraphs: [
          'In broad terms, Stage I often means a smaller cancer that appears more limited to one area. Stage II may mean a larger tumor or a cancer with some local spread but still no distant metastasis. Stage III often means the cancer is more locally advanced, perhaps involving nearby structures or lymph nodes. Stage IV generally means the cancer has spread to distant organs or distant parts of the body.',
          'Those are broad ideas, not universal laws. A Stage III lung cancer is not the same thing as a Stage III colon cancer. Some cancers do not use stages the same way at all, and blood cancers often follow different systems altogether. That is why it helps to ask, “What does this stage mean in this specific cancer?” The answer is usually much more useful than looking at a stage chart with no context.',
        ],
      },
      {
        heading: 'Clinical stage versus pathological stage',
        paragraphs: [
          'Clinical staging happens before major treatment and is based on what doctors know from scans, biopsies, exams, and lab tests. Pathological staging happens after surgery, when a pathologist has more tissue to examine directly. In some cases, the stage changes once surgery provides more information. That does not mean anyone made a mistake. It means the picture became clearer.',
          'This distinction matters because families sometimes hear one stage early and a different stage later and assume the cancer suddenly got worse. Sometimes the reality is simpler: the original stage was the best estimate based on limited information, and the later stage was more precise. Asking whether a stage is clinical or pathological can prevent a lot of unnecessary confusion.',
        ],
      },
      {
        heading: 'What “locally advanced” means',
        paragraphs: [
          '“Locally advanced” usually means the cancer has spread beyond where it began but has not necessarily spread to distant organs. It may involve nearby lymph nodes, nearby tissue, or nearby structures. This phrase often shows up around Stage III cancers, but again, the exact meaning depends on the disease type.',
          'The phrase can sound ominous because it suggests the cancer is no longer small or simple. But it does not automatically mean there are no strong treatment options. Many locally advanced cancers are treated aggressively with combinations of surgery, radiation, chemotherapy, immunotherapy, or targeted therapy. If you hear the phrase, a good follow-up question is: “When you say locally advanced, what does that change about the treatment goal?”',
        ],
      },
      {
        heading: 'Stage is a guide, not a sentence',
        paragraphs: [
          'People often search for survival statistics as soon as they hear a stage. That urge is understandable, but it can be misleading and emotionally brutal. Statistics describe large groups of people treated in the past. They do not account for your loved one’s exact cancer biology, newer therapies, response to treatment, or individual health picture. They can flatten a very personal situation into something that feels hopeless when it may not be.',
          'A more useful mindset is to think of stage as a guide for planning. It helps explain why certain treatments are being recommended and why some options come before others. It does not define a person’s worth, strength, or future in a neat and complete way. If stage feels like the loudest thing in the room, ask your oncologist what other factors matter just as much. That question often reopens the conversation in a more human and realistic direction.',
        ],
      },
      {
        heading: 'Questions to bring to the next visit',
        bullets: [
          'Is this stage clinical or pathological?',
          'What specific findings put the cancer in this stage?',
          'What is the goal of treatment at this stage?',
          'What other factors besides stage are shaping the plan?',
          'Are there biomarkers or molecular tests that matter as much as stage?',
          'Would a second opinion help confirm the stage or treatment approach?',
        ],
      },
    ],
  },
  {
    slug: 'biomarkers-and-targeted-therapy',
    title: 'Biomarkers and Targeted Therapy: What Your Test Results Mean',
    metaDescription:
      'Biomarker testing is changing cancer treatment. Learn what EGFR, PD-L1, HER2, and other markers mean — and why they matter for your treatment plan.',
    tags: ['Understanding Reports', 'Treatment'],
    excerpt:
      'Biomarkers are pieces of information found in the tumor or sometimes in the blood that help doctors understand how a cancer behaves.',
    relatedSlugs: ['what-is-a-pathology-report', 'understanding-clinical-trials', 'cancer-staging-explained'],
    sections: [
      {
        heading: 'What a biomarker actually is',
        paragraphs: [
          'Biomarkers are pieces of information found in the tumor or sometimes in the blood that help doctors understand how a cancer behaves. They can be mutations, proteins, gene rearrangements, or other measurable features. The reason this matters is simple: many cancer treatments work best when the tumor has a specific marker. Without that marker, the same treatment may be less useful or not useful at all.',
          'Families sometimes hear the word biomarker and think it is just another technical detail. In modern oncology, it is often much more than that. Biomarker results can influence whether a person gets immunotherapy, targeted therapy, standard chemotherapy first, or a clinical trial recommendation. That is why many oncologists want molecular or biomarker testing completed before treatment begins, especially in cancers where the results change the order of decisions.',
        ],
      },
      {
        heading: 'Common examples by cancer type',
        paragraphs: [
          'Different cancers have different biomarker patterns. In lung cancer, common biomarkers include EGFR, ALK, ROS1, KRAS, MET, and others. In breast cancer, HER2 is especially important, along with hormone receptors such as estrogen and progesterone. In colon cancer, KRAS, NRAS, BRAF, and MSI/MMR can affect treatment choices. MSI/MMR is also important across several cancers because it can suggest whether immunotherapy may work well.',
          'The key idea is not to memorize every biomarker. The key idea is to understand that the tumor may have a specific signature, and that signature can point toward more personalized treatment. If your family hears a list of marker names that feels overwhelming, ask one practical question: “Which of these results would change the treatment plan the most?” That usually brings the conversation back to what matters right now.',
        ],
      },
      {
        heading: 'What PD-L1 means',
        paragraphs: [
          'PD-L1 is a protein that can help predict whether immunotherapy might be helpful in some cancers, especially certain lung cancers. A higher PD-L1 score does not guarantee a treatment will work, but it can make immunotherapy a more important part of the treatment conversation. Some people hear a high PD-L1 result and assume it means the cancer is worse. That is not what the test is saying. It is telling the team something about how the immune system and tumor may interact.',
          'The exact importance of PD-L1 depends on the cancer type, the stage, and the other biomarker results. It also depends on whether the treatment is being considered alone or in combination with chemotherapy. So PD-L1 is a clue, not a complete answer. A helpful question is: “How does my PD-L1 score affect what you recommend first?”',
        ],
      },
      {
        heading: 'Targeted therapy versus immunotherapy',
        paragraphs: [
          'Targeted therapy is designed to go after a specific molecular abnormality in the cancer. For example, someone with an EGFR mutation in lung cancer may be treated with a drug designed to target that mutation. Immunotherapy works differently. It helps the immune system recognize and attack cancer more effectively. PD-L1 is one example of a marker that can influence immunotherapy decisions.',
          'This difference matters because families sometimes group every “advanced” drug into the same category. They are not the same. A tumor with a strong targetable mutation may push the oncologist toward targeted therapy first. A tumor without that mutation but with a high PD-L1 score may lead to a different plan. This is one reason biomarker testing before treatment is so valuable: it can prevent starting down the wrong road too quickly.',
        ],
      },
      {
        heading: 'Germline versus somatic mutations',
        paragraphs: [
          'Another point of confusion is the difference between germline and somatic mutations. Germline mutations are inherited and present in all the cells of the body. Somatic mutations happen in the tumor itself and are not necessarily inherited. The same word “mutation” can refer to either one, which is why families often need clarification.',
          'This matters because a somatic tumor mutation may guide cancer treatment, while a germline mutation may also have implications for family members and future screening. If your doctor mentions a mutation, it is reasonable to ask, “Is this a tumor mutation, an inherited mutation, or do we still need genetic counseling to sort that out?” That is not overcomplicating things. It is asking the right question.',
        ],
      },
      {
        heading: 'What if the report does not mention biomarkers?',
        paragraphs: [
          'If your pathology report does not mention biomarkers, that does not always mean they were forgotten. Sometimes the tests are ordered separately, sometimes they are still pending, and sometimes they are only appropriate in certain cancer types or stages. But if biomarkers are commonly relevant in that disease, it is absolutely worth asking whether they have been ordered and whether treatment decisions should wait for the results.',
          'A good way to phrase it is: “Before treatment starts, are there biomarker or molecular tests we need so we do not miss an option?” That question can be especially important in lung cancer, metastatic disease, rare cancers, or situations where targeted therapy or immunotherapy may significantly change the plan.',
        ],
      },
      {
        heading: 'Questions to bring forward',
        bullets: [
          'Which biomarkers were tested, and which are still pending?',
          'Do any of these results open the door to targeted therapy or immunotherapy?',
          'Should treatment wait until all biomarker results are back?',
          'Is this mutation inherited or only in the tumor?',
          'Would these results change clinical trial options?',
        ],
      },
    ],
  },
  {
    slug: 'prepare-for-first-oncology-appointment',
    title: 'How to Prepare for Your First Oncology Appointment',
    metaDescription:
      "Your first oncology appointment is one of the most important conversations of your life. Here's exactly how to prepare — including the questions to ask.",
    tags: ['Appointments', 'Caregiver Tips'],
    excerpt:
      'The first oncology appointment often feels like stepping into a conversation that started before you arrived.',
    relatedSlugs: ['what-is-a-pathology-report', 'second-opinion-oncology', 'what-to-expect-during-chemotherapy'],
    sections: [
      {
        heading: 'Why the first visit feels so intense',
        paragraphs: [
          'The first oncology appointment often feels like stepping into a conversation that started before you arrived. There may already be pathology language, scan results, staging terms, treatment options, and unfamiliar drug names in the air. Families frequently leave feeling both relieved to have met the doctor and overwhelmed by how much information landed at once. That reaction is normal.',
          'Preparation does not remove the emotional weight of the moment, but it can make the visit far more useful. The goal is not to control every outcome. The goal is to reduce avoidable confusion, bring the right documents, ask the most important questions, and leave with a clearer picture of what happens next. Even a small amount of preparation can turn a foggy visit into a more grounded one.',
        ],
      },
      {
        heading: 'What to bring',
        bullets: [
          'Pathology reports and any biomarker or molecular test results',
          'Imaging reports and, if possible, CDs or digital files of scans',
          'A current medication list, including supplements',
          'Insurance card and photo ID',
          'A notebook, notes app, or printed question list',
          'A trusted support person if one is available',
        ],
        paragraphs: [
          'Bringing records matters because oncology teams often need to review original documents and images, not just summaries. If something is missing, the appointment can still happen, but decisions may be delayed or less specific. A caregiver can help by making a simple folder with sections for reports, scans, medications, and questions. That small bit of organization can lower stress for everyone in the room.',
        ],
      },
      {
        heading: 'How to organize the medical story quickly',
        paragraphs: [
          'Before the appointment, write a short timeline. Include when symptoms started, when the biopsy happened, when major scans were done, and what the patient has been told so far. Keep it brief. A one-page summary is more helpful than a stack of loose memories. Also write down allergies, major past medical conditions, and any prior cancer history if relevant.',
          'If multiple specialists are already involved, list who they are and what each person has said. Families often discover that the oncology visit is more efficient when the doctor can quickly see the sequence of events. You do not need to create a perfect binder. A clean, one-page timeline and a few key documents are enough to make a big difference.',
        ],
      },
      {
        heading: 'Ten strong questions to ask',
        bullets: [
          'What is the exact diagnosis, in plain language?',
          'What stage is this, and how confident are we in that stage?',
          'Are there biomarker or genetic tests that still need to come back?',
          'What is the goal of treatment right now?',
          'What treatment options do you recommend first, and why?',
          'What are the biggest side effects or tradeoffs to expect?',
          'How quickly do we need to decide?',
          'Would a clinical trial be appropriate at this stage?',
          'What should make us call your office urgently?',
          'What happens next after today?',
        ],
      },
      {
        heading: 'How to handle information overload',
        paragraphs: [
          'No one absorbs everything in the first appointment. Expect that. One person should focus on listening while another writes down key points if possible. If no support person can come, ask permission to record the conversation on your phone. Many oncologists are comfortable with that when asked respectfully. Recording can be especially helpful because stress makes memory unreliable.',
          'It also helps to decide in advance what you need most from the visit. For some families, it is understanding the diagnosis clearly. For others, it is knowing the next treatment step. For others, it is knowing whether there is time for a second opinion. If the conversation starts to move too fast, say, “Before we leave, can you tell us the top three things to remember?” That question can be grounding.',
        ],
      },
      {
        heading: 'What usually happens after the first visit',
        paragraphs: [
          'After the first oncology appointment, there may be more tests, a treatment start date, referrals to surgery or radiation, insurance authorizations, or discussions about a port, additional imaging, or symptom support. Sometimes families expect treatment to start immediately and feel worried if it does not. In many situations, a short period of planning is appropriate and important.',
          'This is also the moment when second opinions, pathology review, and clinical trial evaluation may come into the conversation. If the case is complex, rare, or moving toward a life-changing surgery, it is reasonable to ask whether another expert opinion would be helpful. Good oncologists are used to that question. It is not a sign of mistrust. It is part of thoughtful cancer care.',
        ],
      },
      {
        heading: 'A better definition of being prepared',
        paragraphs: [
          'Being prepared does not mean you show up calm, cheerful, and perfectly informed. It means you bring the essentials, ask honest questions, and give yourself permission not to understand everything immediately. Caregivers often put pressure on themselves to be flawless advocates from the first visit onward. That is not realistic. Good advocacy is usually quieter and more practical than that.',
          'If you leave the appointment knowing the diagnosis, the immediate plan, the next decision point, and who to contact with questions, that is a strong first step. Everything else can build from there.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-clinical-trials',
    title: 'Understanding Clinical Trials: What They Are and How to Find One',
    metaDescription:
      "Clinical trials aren't a last resort — they're often a pathway to cutting-edge treatment. Here's how to understand them and find ones you may qualify for.",
    tags: ['Clinical Trials'],
    excerpt:
      'Clinical trials are research studies that test new ways to prevent, detect, or treat disease.',
    relatedSlugs: ['biomarkers-and-targeted-therapy', 'cancer-staging-explained', 'second-opinion-oncology'],
    sections: [
      {
        heading: 'What a clinical trial is',
        paragraphs: [
          'Clinical trials are research studies that test new ways to prevent, detect, or treat disease. In cancer care, they often evaluate new drugs, new combinations of existing treatments, new sequences of care, or better ways to match therapy to a patient’s tumor biology. Joining a trial is not the same thing as being experimented on without a plan. Trials are structured, reviewed, and monitored carefully, with rules designed to protect participants.',
          'Families sometimes hear “clinical trial” and assume it is only something to discuss when every standard option is gone. That is one possible situation, but it is far from the whole story. Many trials are available earlier in treatment and may be considered precisely because they offer access to promising therapies at an important decision point. A trial can be a first-line option, not just a late-stage backup plan.',
        ],
      },
      {
        heading: 'What the trial phases mean',
        paragraphs: [
          'Phase I trials usually focus on safety and dose finding. They ask questions like: what dose is tolerable, and what side effects emerge? Phase II trials look more closely at whether the treatment appears effective in a specific cancer type or biomarker group. Phase III trials compare a new treatment or strategy against the current standard of care in a larger group of patients. Phase IV happens after approval and looks at longer-term use in the real world.',
          'People often hear “Phase I” and immediately think it must be dangerous. That is understandable, but not always accurate. Some Phase I studies are built on years of lab and earlier human data, and some are highly targeted to biomarker-defined cancers. The right question is not simply “What phase is it?” but “What do we already know, what is the goal of this study, and why do you think it fits my situation?”',
        ],
      },
      {
        heading: 'Common myths that deserve to be retired',
        paragraphs: [
          'One common myth is that clinical trials are only for people who are terminally ill. Another is that everyone on a trial risks getting only a placebo. In cancer trials, placebo-only designs without standard care are uncommon when an effective treatment already exists. More often, a study compares standard treatment plus something new versus standard treatment alone. That is very different from “getting nothing.”',
          'Another myth is that trials mean the doctor has run out of ideas. In reality, many oncologists bring up trials because they believe a specific study may be medically sound, well matched to the patient’s biology, or worth discussing before other doors close. A trial recommendation should lead to more questions, not immediate fear.',
        ],
      },
      {
        heading: 'What eligibility criteria mean',
        paragraphs: [
          'Eligibility criteria are the rules that determine who can join a trial. They may include cancer type, stage, biomarker status, prior treatments, lab values, age, performance status, or location of disease. These rules can feel frustrating, especially when a trial looks promising but the patient misses a requirement by one detail. Still, eligibility criteria exist because researchers need to study treatments in clearly defined groups and keep patients as safe as possible.',
          'If you are reviewing a trial, look first at the cancer type, stage, biomarker requirements, and prior treatment requirements. Then ask your oncologist whether the patient fits the study as written or only “almost fits.” That distinction matters because eligibility exceptions are not always possible.',
        ],
      },
      {
        heading: 'How to search ClinicalTrials.gov without getting lost',
        paragraphs: [
          'ClinicalTrials.gov can feel overwhelming at first. Start by using plain-language filters: disease type, stage, biomarker, treatment setting, and location. Try searching the cancer type plus a key biomarker or treatment goal. If you know the stage or whether the disease is newly diagnosed, recurrent, or metastatic, include that too.',
          'When you open a listing, focus on a few practical fields: the brief title, recruiting status, locations, eligibility criteria, and the intervention being studied. You do not need to understand every scientific detail on the page to decide whether a trial is worth bringing to your oncologist. Your first goal is simply to identify studies that look plausible enough to ask about.',
        ],
      },
      {
        heading: 'Experimental arm versus control arm',
        paragraphs: [
          'Some trials have an experimental arm and a control arm. The experimental arm receives the new treatment or strategy being tested. The control arm usually receives the current standard of care. Being assigned to the control arm does not mean receiving inferior treatment. It usually means receiving what would already be considered appropriate outside the study.',
          'Randomization can be emotionally hard because it feels like giving up control. If that is a concern, ask whether the study is randomized, what each arm receives, and whether crossover is possible if the cancer changes course. Those details help families decide whether the structure of the trial feels acceptable.',
        ],
      },
      {
        heading: 'Questions to ask your oncologist',
        bullets: [
          'Why do you think this trial fits my exact cancer and biomarker profile?',
          'What would I receive on each arm of the study?',
          'How does this compare with standard treatment outside a trial?',
          'What extra visits, labs, scans, or travel would be required?',
          'Would this trial close off any future treatment options?',
          'If I do not join now, could I still join later?',
        ],
      },
    ],
  },
  {
    slug: 'appeal-insurance-denial-cancer',
    title: 'How to Appeal an Insurance Denial for Cancer Treatment',
    metaDescription:
      'A cancer treatment denial from your insurance company is not the final word. Here’s a step-by-step guide to filing an effective appeal.',
    tags: ['Insurance & Financial Help'],
    excerpt:
      'A denial letter can feel like the ground dropping out from under an already stressed family.',
    relatedSlugs: ['financial-help-cancer-patients', 'prepare-for-first-oncology-appointment', 'second-opinion-oncology'],
    sections: [
      {
        heading: 'The denial is not the final answer',
        paragraphs: [
          'A denial letter can feel like the ground dropping out from under an already stressed family. It can sound final, urgent, and deeply unfair all at once. But in cancer care, an insurance denial is often the beginning of an appeal process, not the end of the story. Insurers deny treatment for many reasons, including coding issues, missing records, claims that a treatment is not medically necessary, or disagreement about whether a request fits a coverage policy.',
          'That does not make the denial acceptable, but it does mean there are structured next steps. Families often lose precious time because they spend the first few days feeling frozen or trying to understand the denial letter line by line. The better move is to identify what kind of denial it is, what deadline applies, what supporting records are needed, and which person on the care team can help move the appeal forward.',
        ],
      },
      {
        heading: 'Start with the denial letter',
        paragraphs: [
          'Read the denial letter closely, but focus on the actionable parts. Look for the reason for denial, the service or treatment that was denied, the date, the appeal deadline, and instructions for filing an internal appeal. Many letters also cite policy language or claim the requested treatment is investigational, out of network, or not medically necessary. These details help shape the appeal strategy.',
          'If the letter is unclear, call the insurer and ask them to explain the exact denial reason in plain language. Write down the name of the representative, the call reference number, and what they say. Keep a running log of every phone call, fax, and upload. In appeals, documentation matters almost as much as persistence.',
        ],
      },
      {
        heading: 'Internal appeal versus external appeal',
        paragraphs: [
          'An internal appeal asks the insurance company to review its own decision. This is usually the first step. An external appeal asks for review by an independent third party outside the insurer. External appeals are especially important when an internal appeal is denied and the treatment remains medically necessary or time sensitive.',
          'Many families do not realize they may have a right to an external review. That right depends on the plan type, state rules, and the specific denial, but it is often worth asking about early. If the treatment is urgent, ask whether the appeal can be expedited. Cancer care frequently qualifies for faster review when delay could seriously affect health.',
        ],
      },
      {
        heading: 'What to include in the appeal packet',
        bullets: [
          'The denial letter',
          'A formal appeal letter from the patient or caregiver',
          'A letter of medical necessity from the oncologist',
          'Relevant pathology, imaging, and clinic notes',
          'Published guidelines or studies if the oncologist recommends them',
          'Any biomarker or molecular testing that supports the request',
        ],
        paragraphs: [
          'The oncologist’s letter of medical necessity is often the centerpiece of the appeal. It should explain why the requested treatment is appropriate, why alternatives may be less suitable, and what harm could come from delay. If the denial involves a targeted therapy or biomarker-driven treatment, the letter should connect the tumor biology directly to the treatment recommendation whenever possible.',
        ],
      },
      {
        heading: 'When to ask for peer-to-peer review',
        paragraphs: [
          'A peer-to-peer review happens when the treating physician speaks directly with a doctor working for the insurer. Sometimes this is the fastest way to correct a denial that reflects incomplete understanding of the case. It is not always successful, but it can be a crucial step, especially when there is strong guideline support and the request is time sensitive.',
          'Ask the oncology office whether a peer-to-peer review has been requested or would help. Offices that handle cancer care deal with this often. You do not have to figure it out alone. A calm but persistent caregiver can help by keeping track of deadlines and checking whether the office has what it needs to push the review forward.',
        ],
      },
      {
        heading: 'Escalation when the insurer keeps saying no',
        paragraphs: [
          'If the denial stands after internal review, look into external appeal rights right away. In some situations, it can also help to file a complaint with the state insurance commissioner, especially if deadlines, notices, or review rights are not being handled properly. For employer-sponsored plans, the process may differ slightly, but documentation still matters.',
          'There are also organizations that can help families navigate denials and appeals. The Cancer Legal Resource Center, PAN Foundation, hospital financial counselors, and oncology social workers can all be valuable allies. Sometimes the most important shift is moving from “We have been denied” to “We are now building the appeal file.” That change in mindset restores a sense of movement.',
        ],
      },
      {
        heading: 'What to do today',
        bullets: [
          'Mark the appeal deadline on your calendar',
          'Request the denial reason in plain language if needed',
          'Ask the oncology office for a letter of medical necessity',
          'Request an expedited appeal if time matters',
          'Keep copies of every record, fax, and upload confirmation',
          'Ask about external review before the internal appeal is finished',
        ],
      },
    ],
  },
  {
    slug: 'financial-help-cancer-patients',
    title: 'Financial Help for Cancer Patients: Assistance Programs You May Not Know About',
    metaDescription:
      'Cancer treatment is expensive. These financial assistance programs can help with co-pays, medication costs, travel, and more — and many go unclaimed.',
    tags: ['Insurance & Financial Help'],
    excerpt:
      'Cancer costs add up quickly, and the burden is rarely limited to one bill or one category.',
    relatedSlugs: ['appeal-insurance-denial-cancer', 'caregiver-burnout', 'prepare-for-first-oncology-appointment'],
    sections: [
      {
        heading: 'Financial stress is part of the care experience',
        paragraphs: [
          'Cancer costs add up quickly, and the burden is rarely limited to one bill or one category. There may be deductibles, co-pays, drug costs, travel expenses, time away from work, parking, child care, nutritional needs, and housing costs if treatment happens far from home. Families often assume there is no point asking for help until they are already in crisis. That delay can make the situation much harder than it needs to be.',
          'The truth is that many assistance programs exist, but they are scattered across nonprofits, hospital systems, foundations, and manufacturer support programs. The hardest part is often not that help does not exist. It is that the family does not know where to start or assumes they will not qualify. A practical first step is to think of financial help as part of the treatment plan, not as a side issue.',
        ],
      },
      {
        heading: 'Manufacturer assistance and co-pay programs',
        paragraphs: [
          'Many drug manufacturers offer patient assistance programs or co-pay assistance for eligible patients. These programs can sometimes reduce out-of-pocket costs for expensive cancer medications, especially oral therapies or drugs given over a long period of time. Eligibility varies by insurance type and income, so it is worth asking even if you are unsure.',
          'If the patient has commercial insurance, co-pay cards may help with cost sharing. If the patient is uninsured or underinsured, manufacturer programs sometimes provide medication directly or at a lower cost. Oncology offices and specialty pharmacies often know how to start these applications quickly. Ask whether the medication being prescribed has a patient assistance program tied to it.',
        ],
      },
      {
        heading: 'Nonprofit foundations that help with treatment costs',
        paragraphs: [
          'National foundations can help with co-pays, premiums, transportation, lodging, and emergency household needs. Organizations such as PAN Foundation, HealthWell Foundation, CancerCare, and NeedyMeds are worth checking early. Funds may open and close depending on demand, so persistence matters. If a fund is closed one day, it may reopen later.',
          'These programs often require specific diagnosis information, insurance details, and income documentation. It helps to keep a small financial-aid folder with tax information, proof of income, and key insurance documents. That way, if a social worker or navigator says, “Apply now,” you can move quickly instead of starting from scratch.',
        ],
      },
      {
        heading: 'Hospital financial assistance and charity care',
        paragraphs: [
          'Many hospitals have financial assistance policies, but families do not always hear about them unless they ask. Hospital-based charity care can sometimes reduce or forgive bills depending on income and the institution’s policy. This is especially important if treatment is happening at a large health system where facility charges, imaging, infusions, and procedures can stack up quickly.',
          'Ask to speak with the hospital financial counselor or social worker. Those roles exist for a reason. Saying “We are worried about cost and do not know what help is available” is not embarrassing or unusual. It is a normal and responsible thing to raise early.',
        ],
      },
      {
        heading: 'Travel, lodging, disability, and daily life support',
        paragraphs: [
          'Some of the most painful expenses are not strictly medical. Travel to treatment, hotels near a cancer center, gas, meals, and missed work can become just as destabilizing as the bills themselves. Programs such as American Cancer Society Hope Lodge and Joe’s House can help with lodging. Some local charities, religious communities, or cancer center foundations also offer gas cards or transportation help.',
          'In longer treatment courses, Social Security Disability benefits may also be worth exploring. Some cancer diagnoses qualify for expedited consideration. That process can take effort, but it may provide crucial income support during a difficult stretch. A hospital social worker can often help point you toward the right benefit programs and community resources.',
        ],
      },
      {
        heading: 'Prescription assistance and the role of social work',
        paragraphs: [
          'Prescription assistance programs are not just for uninsured patients. Even insured patients can face major specialty drug costs. Social workers, financial navigators, and specialty pharmacy teams often know which foundations are currently open and which applications move fastest. They can also tell you which documents to gather before a fund opens.',
          'Caregivers sometimes hesitate to “bother” the social worker with money questions because the diagnosis itself feels more urgent. In reality, financial distress can directly affect treatment adherence, transportation, medication access, and emotional well-being. Asking for financial help is not separate from good care. It is part of protecting the patient and the household.',
        ],
      },
      {
        heading: 'A simple action plan',
        bullets: [
          'Ask the oncology office if a financial navigator or social worker is available',
          'Check for manufacturer assistance tied to current medications',
          'Review nonprofit foundations such as PAN, HealthWell, CancerCare, and NeedyMeds',
          'Ask the hospital about charity care or financial assistance policies',
          'Explore travel and lodging support if treatment is far from home',
          'Keep documents organized so applications can move quickly',
        ],
      },
    ],
  },
  {
    slug: 'second-opinion-oncology',
    title: 'Second Opinions in Oncology: Why They Matter and How to Get One',
    metaDescription:
      "A second opinion in oncology is not disloyal — it's smart medicine. Here's when to seek one, how to ask, and what to bring.",
    tags: ['Appointments', 'Treatment'],
    excerpt:
      'A second opinion in oncology is not a betrayal of the first doctor. It is a normal part of careful cancer care.',
    relatedSlugs: ['prepare-for-first-oncology-appointment', 'understanding-clinical-trials', 'cancer-staging-explained'],
    sections: [
      {
        heading: 'Why second opinions are normal',
        paragraphs: [
          'A second opinion in oncology is not a betrayal of the first doctor. It is a normal part of careful cancer care, especially when the diagnosis is rare, the treatment choices are complex, or the consequences of the next decision are major. Many oncologists expect patients to seek another expert perspective and do not take it personally. In fact, a good oncologist may encourage it.',
          'Families sometimes avoid second opinions because they worry about looking ungrateful, delaying treatment, or creating conflict. Those worries are understandable, but they should not automatically stop the conversation. A second opinion can confirm the current plan, offer a better explanation, identify additional testing, or uncover a clinical trial or surgical option that had not been discussed yet.',
        ],
      },
      {
        heading: 'When a second opinion matters most',
        paragraphs: [
          'Second opinions can be especially valuable when the cancer is rare, when surgery would be life changing, when pathology is complex, when the stage is uncertain, or when a major treatment choice depends on subtle interpretation. They can also help when a family feels confused rather than truly reassured after the first visit. Confusion is often a reasonable reason to seek another set of eyes.',
          'They are also important when biomarker-driven treatment, advanced surgery, transplant, or clinical trial enrollment is on the table. In those situations, seeing a specialist at a high-volume or NCI-designated cancer center can change the quality of the conversation, even if the final treatment still happens close to home.',
        ],
      },
      {
        heading: 'How to ask your current oncologist',
        paragraphs: [
          'The cleanest way to ask is often the simplest: “We would like a second opinion so we can feel confident about the plan.” You do not need to over-explain or apologize. If the doctor reacts professionally, that is a good sign. If they help you identify the right specialist, even better.',
          'You can also ask the team which records should be sent and whether they recommend a specific center or specialist for this disease. Some oncologists appreciate knowing a second opinion is happening because they can help the outside team get the relevant documents faster. Good collaboration often improves the patient experience.',
        ],
      },
      {
        heading: 'What to bring in a second-opinion packet',
        bullets: [
          'Pathology reports and, if possible, pathology slides or tissue availability information',
          'Imaging reports and scan files',
          'Operative notes if surgery has already happened',
          'Clinic notes from key oncology visits',
          'Biomarker and molecular test results',
          'A timeline of symptoms, tests, and treatments so far',
        ],
        paragraphs: [
          'The more complete the packet, the more specific the second opinion can be. Missing pathology or imaging often turns the visit into a general discussion instead of a precise recommendation. Caregivers are often the ones who make the packet happen, and that work can be enormously valuable.',
        ],
      },
      {
        heading: 'Why major cancer centers can help',
        paragraphs: [
          'NCI-designated cancer centers and other high-volume academic programs often see uncommon cases more frequently, run more clinical trials, and include more subspecialists. That does not mean community oncology is inferior. It means some situations benefit from concentrated expertise. A specialist who sees the same rare diagnosis every week may notice options others reasonably do not think about as often.',
          'Remote and online second-opinion programs from institutions such as Mayo Clinic, Cleveland Clinic, and MD Anderson can also be worth exploring, especially if travel is difficult. These programs are not always cheap, and insurance coverage varies, but they can provide clarity without requiring immediate long-distance travel.',
        ],
      },
      {
        heading: 'What if the opinions differ?',
        paragraphs: [
          'If the two opinions differ, do not panic. Different experts may reasonably prioritize different options, especially when more than one acceptable path exists. The right next step is to ask each team to explain why they prefer their recommendation, what evidence or experience supports it, and what tradeoffs come with each path.',
          'Sometimes the best decision comes from the overlap between both opinions. Sometimes the difference points to a missing piece of information, such as a pathology review or biomarker result that should be clarified before moving ahead. A disagreement does not always mean one doctor is wrong. It may mean the case deserves one more layer of careful review.',
        ],
      },
      {
        heading: 'A grounded way to think about second opinions',
        paragraphs: [
          'Seeking a second opinion is not disloyal. It is not dramatic. It is not “being difficult.” It is a way of honoring how important the next decision is. If the second opinion confirms the original plan, you gain confidence. If it changes the plan, you gain options. Either way, you gain information.',
        ],
      },
    ],
  },
  {
    slug: 'caregiver-burnout',
    title: 'Caregiver Burnout Is Real: How to Recognize It and What to Do',
    metaDescription:
      'Caring for someone with cancer is one of the hardest things a person can do. Caregiver burnout is real — and recognizing it is the first step to getting support.',
    tags: ['Caregiver Support'],
    excerpt:
      'Caregiver burnout is not weakness, selfishness, or proof that you love the person less.',
    relatedSlugs: ['financial-help-cancer-patients', 'prepare-for-first-oncology-appointment', 'what-to-expect-during-chemotherapy'],
    sections: [
      {
        heading: 'What caregiver burnout really is',
        paragraphs: [
          'Caregiver burnout is not weakness, selfishness, or proof that you love the person less. It is what can happen when the body and mind are asked to stay alert, useful, emotionally available, and responsible for too long with too little recovery. Cancer caregiving often compresses medical fear, practical work, grief, and uncertainty into the same stretch of time. Even strong, devoted people can start to run on fumes.',
          'Burnout can show up gradually. You may not notice it at first because you are busy doing what needs to be done. But when survival mode becomes the default setting for weeks or months, the body often starts sending signals. Recognizing those signals early is not indulgent. It is protective.',
        ],
      },
      {
        heading: 'Common signs',
        paragraphs: [
          'Burnout can look like constant exhaustion, short temper, numbness, resentment, trouble sleeping, forgetfulness, headaches, getting sick more often, or withdrawing from people you usually lean on. Some caregivers feel guilty because they notice flashes of anger or a desire to escape. Those feelings can be frightening, but they are not uncommon. They often signal overload, not lack of love.',
          'Sometimes burnout also looks like overfunctioning: never stopping, never asking for help, and feeling unable to sit down without guilt. That can be harder to recognize because it can look productive from the outside. But nonstop productivity can still be a distress response.',
        ],
      },
      {
        heading: 'Why caregivers resist getting help',
        paragraphs: [
          'Caregivers often believe they are the safety net, and safety nets are not supposed to need help. There may also be practical reasons: limited money, limited time, family conflict, or the feeling that nobody else can handle the details correctly. All of that is real. But the belief that asking for help creates more work can quietly lock people into deeper exhaustion.',
          'Another barrier is guilt. Many caregivers think rest or joy somehow betrays the seriousness of what is happening. But the opposite is usually true. A caregiver who gets no support becomes more depleted, less steady, and more vulnerable to health problems of their own. That helps no one.',
        ],
      },
      {
        heading: 'Practical ways to reduce the load',
        bullets: [
          'Accept one concrete offer of help instead of saying “we are fine” automatically',
          'Make a short list of tasks other people can do without special training',
          'Schedule breaks before you feel desperate for one',
          'Use respite care, home health, or volunteer help if available',
          'Let someone else handle food, rides, laundry, or updates for a day',
        ],
        paragraphs: [
          'The trick is to make help specific. “Let me know if you need anything” is hard to use when you are exhausted. “Can you bring dinner Wednesday?” is much easier. So is “Can you sit with them for two hours while I nap?” Tiny pieces of relief still count.',
        ],
      },
      {
        heading: 'Emotional support matters too',
        paragraphs: [
          'Sometimes practical help is not the deepest need. Sometimes the caregiver needs a place to say the frightening or conflicted thing out loud. Therapy, caregiver support groups, hospital social workers, chaplains, and trusted friends can all play that role. Family Caregiver Alliance and the AARP Caregiver Support Line are good starting points if you do not know where to begin.',
          'If formal therapy is not possible right now, even one person who can listen without fixing everything can make a difference. The goal is not to build a perfect support system overnight. The goal is to stop carrying the emotional weight entirely alone.',
        ],
      },
      {
        heading: 'The oxygen mask principle',
        paragraphs: [
          'The oxygen mask principle is simple: caring for yourself is part of caring for your loved one. Sleep, food, hydration, movement, fresh air, and short moments of relief are not luxuries in this context. They are maintenance for the person holding the line.',
          'You do not have to become serene. You do not need to meditate perfectly or suddenly love self-care language. You just need to remember that your body is not separate from the caregiving work. If you are falling apart, the work becomes harder. Small acts of care are not selfish. They are stabilizing.',
        ],
      },
      {
        heading: 'A word to the caregiver reading this',
        paragraphs: [
          'If you are tired in ways you cannot explain, if you feel guilty for needing space, or if you barely recognize yourself some days, you are not failing. You are responding to something extraordinarily hard. You are doing something loving and complicated and relentless. That deserves honesty, support, and real care. You are doing something extraordinary.',
        ],
      },
    ],
  },
  {
    slug: 'what-to-expect-during-chemotherapy',
    title: 'What to Expect During Chemotherapy: A Practical Guide for Patients and Families',
    metaDescription:
      'Starting chemotherapy brings uncertainty. This practical guide helps you and your family know what to expect — before, during, and after each session.',
    tags: ['Treatment'],
    excerpt:
      'Chemotherapy is a word almost everyone recognizes, but many families start treatment with only a vague sense of what the day-to-day reality will be.',
    relatedSlugs: ['prepare-for-first-oncology-appointment', 'caregiver-burnout', 'understanding-clinical-trials'],
    sections: [
      {
        heading: 'Before the first treatment day',
        paragraphs: [
          'Chemotherapy is a word almost everyone recognizes, but many families start treatment with only a vague sense of what the day-to-day reality will be. That uncertainty can make the lead-up feel frightening. It helps to know that chemotherapy is not one single experience. The drugs, schedule, goals, and side effects vary by cancer type and treatment plan. Even so, there are common patterns that can make the process feel more understandable.',
          'Before treatment starts, the oncology team usually reviews the plan, explains side effects to watch for, checks blood work, and discusses logistics such as how often treatment will happen. Some patients receive chemotherapy through an IV in the arm, some through a port, and some take oral chemotherapy at home. If you do not know which type is being used, that is one of the first questions to ask.',
        ],
      },
      {
        heading: 'What happens on infusion day',
        paragraphs: [
          'On an infusion day, the patient may first check in, have vital signs taken, and sometimes have lab work drawn. The team often reviews whether blood counts or organ function are safe enough for treatment that day. Medications to prevent nausea or reactions may be given before the chemotherapy itself starts. Then the chemotherapy drugs are infused according to the plan, which can take anywhere from a short visit to many hours.',
          'The infusion space may feel calmer than families expect. Some people nap, read, talk quietly, or watch shows. It is still a big day, but it is often less dramatic in the room than what many people imagine beforehand. Bringing comfort items can help make the day easier.',
        ],
      },
      {
        heading: 'What to bring',
        bullets: [
          'Water or another drink the patient tolerates well',
          'Snacks that are easy on the stomach',
          'A blanket, sweater, or layers',
          'Phone charger, headphones, books, or small distractions',
          'A medication list and questions for the team',
          'Something to help pass the time if the infusion is long',
        ],
      },
      {
        heading: 'Common side effects in plain language',
        paragraphs: [
          'Chemotherapy often affects fast-growing cells. That is part of how it works against cancer, but it can also affect healthy cells in places like the digestive tract, hair follicles, and bone marrow. That is why side effects such as nausea, diarrhea, mouth sores, hair loss, and fatigue can happen. Not every patient gets every side effect, and many can be managed better now than people expect.',
          'Fatigue is often one of the biggest surprises because it can be deeper than ordinary tiredness. Some people feel okay on infusion day and worse a few days later. Others feel the pattern build with each cycle. A caregiver can help by noticing the patient’s rhythm instead of assuming every day after chemo will feel the same.',
        ],
      },
      {
        heading: 'Symptoms that need an urgent call',
        paragraphs: [
          'Some side effects require immediate contact with the oncology team. Fever is a major one, especially because chemotherapy can lower white blood cells and make infection more dangerous. The team should tell you exactly what temperature counts as urgent. Other urgent symptoms may include trouble breathing, severe dehydration, confusion, uncontrolled vomiting, chest pain, or sudden bleeding.',
          'This is one of the most practical questions to ask before treatment starts: “What symptoms mean we should call right away, even at night or on the weekend?” Write that answer down. It can reduce hesitation when the family is tired and scared.',
        ],
      },
      {
        heading: 'Food, hydration, and activity during treatment',
        paragraphs: [
          'Patients often do better when hydration and food are treated as part of care, not as an afterthought. Small frequent meals may work better than big ones. Bland foods can be easier during nausea. Staying hydrated is especially important when there is vomiting or diarrhea. The care team may also recommend supplements or nutrition counseling if eating becomes hard.',
          'Activity usually needs to become gentler and more flexible, not disappear completely. Short walks, light stretching, and getting outside when possible can help with energy, mood, and digestion. Rest still matters, but complete inactivity can sometimes make the body feel worse.',
        ],
      },
      {
        heading: 'How caregivers can help',
        paragraphs: [
          'Caregivers often help most by making the basics easier: rides, tracking medications, watching for side effects, managing communication, and protecting rest. They can also help by noticing patterns the patient may be too worn down to name, such as “You seem most nauseated on day three” or “Your appetite is usually better at breakfast than dinner.”',
          'Just as important, caregivers should not assume they need to guess what is normal. The oncology team expects questions. If something feels different, say so. The patient does not need the caregiver to be a silent observer. They need a second set of eyes and a steady advocate.',
        ],
      },
      {
        heading: 'The emotional side of chemotherapy',
        paragraphs: [
          'People often prepare for the physical part of chemotherapy and underestimate the emotional part. Fear, sadness, anger, numbness, and relief can all show up at once. Some patients feel stronger once treatment starts because there is finally a plan. Others feel more vulnerable because the reality of cancer becomes harder to ignore. Both reactions are normal.',
          'The best expectation may be this: chemotherapy usually becomes more manageable when it becomes more familiar. The first cycle often carries the most uncertainty. Over time, families learn the rhythm, the warning signs, the better snacks, the better timing, and the questions worth calling about. It may never feel easy, but it can start to feel less unknown.',
        ],
      },
    ],
  },
];

export function getResourceArticle(slug: string) {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug) ?? null;
}
