export const FAQS = [
  {
    "question": "What is Wisely Threat Intelligence?",
    "answer": "<p>Wisely Threat Intelligence is a curated Threat Intelligence Product. It serves as a centralized \"nerve center\" that collects, cleanses, and enriches raw threat signals (scam SMS, malicious URLs, fraudulent A-Parties, and Use case categories) into actionable data objects that can be consumed directly by security systems.</p>"
  },
  {
    "question": "How does this differ from standard threat feeds?",
    "answer": "<p>While most threat feeds merely identify \"bad actors,\" Wisely Threat Intelligence delivers deep Contextual Intelligence. By mapping the complete Attack Use Case—from predatory loanware to sophisticated gaming fraud—WTI enables consumers to move beyond the \"who\" to understand the \"how.\" It provides a comprehensive view of the attack structure, including pre-attack reconnaissance and the specific Calls to Action (CTAs) used to lure victims. Crucially, WTI aggregates and correlates this data to link fraudulent communication directly back to the target through the NIK, providing an unparalleled level of citizen-centric protection.</p>"
  },
  {
    "question": "Who are the target users for Wisely Threat Intelligence?",
    "answer": "<p>Wisely Threat Intelligence has the following 6 key personas:</p><ul><li><strong>Enterprises:</strong> Harden user onboarding by cross-referencing new registrations against a repository of 3M+ confirmed fraud identities and automate the suppression of malicious internal assets to drastically reduce security operational costs (OPEX).</li><li><strong>Citizens:</strong> Benefit from a \"crowd-sourced immune system\" that provides proactive protection against scams and offers a transparent, verifiable mechanism to appeal and resolve any complaints.</li><li><strong>Telecommunications Operators:</strong> Execute network-level blocking of scam calls and SMS in under five minutes, reducing customer churn and enhancing brand trust through proactive threat neutralization.</li><li><strong>Banks &amp; Financial Institutions:</strong> Instantly identify mule accounts and freeze fraudulent transactions by correlating real-time cross-sector signals, such as SIM swap alerts, before funds leave the ecosystem.</li><li><strong>Digital Platforms (Google, Meta, etc.):</strong> Immediately suppress malicious assets like fake profiles or URLs and update global safety systems with verified threat signatures to block harmful app installations.</li><li><strong>Regulators (OJK/Komdigi):</strong> Gain a unified, holistic view of the national threat landscape to accelerate enforcement actions and automate compliance auditing through real-time dashboards.</li></ul>"
  },
  {
    "question": "What are the threat indicators provided in Wisely Threat Intelligence?",
    "answer": "<p>Wisely Threat Intelligence (WTI) provides a comprehensive set of Contextual Intelligence indicators that map the entire \"scam journey\". These indicators move beyond simple lists of bad actors to provide structured, actionable data objects. The 7 core threat indicators and data points include:</p><h3>Infrastructure &amp; Identity Indicators:</h3><ul><li><strong>A-Party Identifiers:</strong> Tracking of phone numbers, IMSI (International Mobile Subscriber Identity), and IMEI (International Mobile Equipment Identity) associated with fraudulent activity.</li><li><strong>Identity Mapping:</strong> Correlation of scam communications back to a citizen's NIK (National Identification Number) to identify the real-world actors behind threat campaigns.</li><li><strong>Operational Status:</strong> Real-time classification of actors as \"Alive\" (actively delivering attacks) or \"Dead\" (successfully neutralized or dormant).</li></ul><h3>Communication Indicators:</h3><ul><li><strong>Use Cases:</strong> The category of Scam message classified based on AI Prediction.</li><li><strong>CTAs:</strong> The malicious URLs and Whatsapp links used during scam activity by the scammer.</li><li><strong>Temporal Tracking:</strong> Data on when a threat was First Observed versus Last Observed to measure the Age in Network and the speed of neutralization.</li><li><strong>Network Metadata:</strong> Information on the Operator and HLR (Home Location Register) where the threat originated.</li></ul>"
  },
  {
    "question": "What are the top takeaways from Wisely Threat Intelligence?",
    "answer": "<ul><li><strong>Massive Scale (3M Data Points):</strong> Launches with 3 million verified indicators, providing deep Contextual Intelligence (mapping the \"how\" and \"who\") rather than just simple blacklists.</li><li><strong>Identity-Linked Defense (NIK Mapping):</strong> The first repository to map scam patterns directly to a verified NIK, unmasking the real-world actors behind industrial-scale fraud.</li><li><strong>Predictive Foresight:</strong> Analyzes historical data to identify Indicators of Attack (IOAs), allowing enterprises to harden defenses against emerging fraud vectors before they strike.</li><li><strong>Real-Time Neutralization:</strong> Achieves a time-to-identify of &lt;5 minutes, updating with 20,000 new threats daily to shift from reactive blocking to proactive prevention.</li><li><strong>Cross-Sector Immunity:</strong> Acts as a collective defense hub where Telcos, Banks, and Platforms share real-time signals (like SIM swaps) that no single entity could detect alone.</li><li><strong>Economic Impact (OPEX Reduction):</strong> Automates threat suppression to slash manual security costs and combat Indonesia's $5 billion annual fraud loss.</li></ul>"
  },
  {
    "question": "Does WTI see personal data?",
    "answer": "<p>No raw PII leaves contributors. WTI uses hashes/tokenization and data minimization for Victims information; however, fraudulent assets are shared for lookup.</p>"
  },
  {
    "question": "Is it compliant with Indonesia's PDP Law?",
    "answer": "<p>Yes. WTI implements PDP principles (lawful basis, minimization, purpose limitation, security, data localization), RBAC, and transparency.</p>"
  },
  {
    "question": "Does Wisely Threat Intelligence share data only with Indonesia?",
    "answer": "<p>No. Anonymized indicators can be shared via ASEAN/GASA/APAC CERT frameworks under a lawful basis so that scammers globally can be eliminated.</p>"
  },
  {
    "question": "Can citizens report fraud directly?",
    "answer": "<p>Yes. A public portal and chatbot allow citizens to report scam calls, SMS, and online fraud. Each report receives a case ID and status updates until resolution.</p>"
  },
  {
    "question": "Can citizens look up a phone number or link before they click on it?",
    "answer": "<p>Yes. The platform provides a public \"Threat Lookup\" tool. By entering a phone number (A-Party) or a URL into the search bar, you can instantly see its Operational Status. The system will flag if the number is currently \"Alive\" (actively linked to scams) or if the link is a known signature for Predatory Loanware or Gaming Fraud.</p>"
  },
  {
    "question": "How are citizens incentivized for helping keep the network safe?",
    "answer": "<p>To encourage \"Digital Gotong Royong\" (communal cooperation), IOH rewards active contributors. Every time you submit a report that is verified by WTI as a legitimate new threat, you are eligible for \"Safe Citizen\" Data Packs. These are free data bundles (e.g., 1GB or 2GB packs) credited directly to your IM3 or Tri account as a thank-you for helping protect the other 100 million users on the network.</p>"
  },
  {
    "question": "Does my report stay anonymous, and how is it linked to the attacker?",
    "answer": "<p>Your privacy is a priority. While your report is submitted securely, WTI uses its Identity Mapping capability to correlate the scam pattern you received with the attacker's NIK. This allows the platform to unmask the industrial-scale \"bad actor\" behind the message without exposing your personal information to the fraudster.</p>"
  },
  {
    "question": "Can citizens know if their NIK is being used in any fraudulent action?",
    "answer": "<ul><li><strong>Look it up:</strong> Use the Check NIK feature in your Wisely Threat Intelligence.</li><li><strong>Report &amp; Block:</strong> Tap the \"Unrecognized Number\" button. This sends a real-time trigger to the WTI repository to mark that SIM as \"Dead.\"</li><li><strong>Get Rewarded:</strong> Verified reports of identity theft contribute to the community's safety and, for IOH users, can qualify you for the \"Safe Citizen\" Data Packs.</li></ul>"
  },
  {
    "question": "What data consumption methods are supported for real-time integration?",
    "answer": "<p>WTI is built on a \"Single API\" architecture for maximum compatibility. Enterprises can consume the data through:</p><ul><li><strong>RESTful APIs:</strong> The primary method for automated ingestion, providing high-fidelity JSON payloads of threat indicators.</li><li><strong>Webhooks:</strong> Real-time push notifications that trigger your internal systems the moment a new threat (like a high-risk malicious APK) is identified.</li><li><strong>Centralized Dashboard:</strong> A role-based web interface for manual lookups, reporting, and visual threat analysis.</li></ul>"
  },
  {
    "question": "Who is eligible to access the WTI repository and its APIs?",
    "answer": "<p>Access is strictly governed via Role-Based Access Control (RBAC) and is limited to:</p><ul><li><strong>Regulated Entities:</strong> Banks and Fintechs (OJK/BI regulated) for fraud mitigation.</li><li><strong>Telecommunications Operators:</strong> For network-level threat neutralization.</li><li><strong>Authorized Government Agencies:</strong> For national security and regulatory oversight.</li><li><strong>Large Enterprises:</strong> Organizations with a verified need to protect their digital assets and customer onboarding processes.</li></ul><p>Note: All partners must go through a KYC (Know Your Customer) process and onboard through the Wisely Partner Marketplace to generate secure API Keys.</p>"
  },
  {
    "question": "Can citizens integrate to the WTI API?",
    "answer": "<p>Direct API integration is not available for individual citizens. While Wisely Threat Intelligence (WTI) is a powerful tool for national security, its raw API access is strictly governed to prevent the data from being misused or falling into the hands of the very \"bad actors\" it tracks.</p>"
  },
  {
    "question": "What kind of insights can you get from Wisely Threat Intelligence?",
    "answer": "<h3>Strategic &amp; Geographic Insights</h3><ul><li><strong>Temporal Peak Analysis:</strong> Identifies the \"Top Time of Attack\" to help organizations staff their security teams during high-risk windows.</li><li><strong>Geospatial Hotspots:</strong> Maps the \"Top Regions\" where fraudulent activity is concentrated to pinpoint regional scam clusters.</li><li><strong>Threat Categorization:</strong> Tracks \"Top Use Case Categories\" (e.g., loanware, gaming fraud) and identifies \"Net New Use Cases\" to keep pace with evolving criminal tactics.</li></ul><h3>Actor &amp; Campaign Intelligence</h3><ul><li><strong>High-Volume Offender Tracking:</strong> Identifies the \"Top Phone Numbers\" (A-Parties) driving industrial-scale attacks.</li><li><strong>Cross-Channel Correlation:</strong> Pinpoints \"Single-Channel Campaigns\" (e.g., activity appearing only on WhatsApp but not SMS) to help platforms understand attacker preferences.</li></ul><h3>Behavioral &amp; Network Anomalies</h3><ul><li><strong>Unidirectional Traffic Signals:</strong> Flags users with \"Only Outgoing but No Incoming\" logs—a classic signature of automated bot dialers or \"blast\" scam scripts.</li><li><strong>SIM Swap Intelligence:</strong> Monitors for unauthorized SIM replacement activity, a critical early-warning signal for potential Account Takeover (ATO) attempts in banking and fintech.</li></ul>"
  },
  {
    "question": "How do \"Top Regions\" and \"Time of Attack\" insights help in stopping fraud?",
    "answer": "<p>By mapping Geospatial Hotspots and Temporal Peaks, WTI allows law enforcement and security teams to move from broad monitoring to \"surgical\" intervention.</p><ul><li><strong>Business Outcome:</strong> Banks can apply \"Step-up Authentication\" (extra security checks) only for transactions originating from a high-risk region during its peak attack window, reducing friction for 99% of other users.</li><li><strong>Law Enforcement:</strong> Agencies can allocate physical resources to \"scam hubs\" in specific provinces where industrial-scale operations are concentrated.</li></ul>"
  },
  {
    "question": "What is the value of tracking \"Net New Use Cases\" and \"Top Phone Numbers\"?",
    "answer": "<p>WTI doesn't just block old scams; it identifies the birth of a new campaign.</p><ul><li><strong>Business Outcome:</strong> When WTI identifies a \"Net New Use Case\" (like a new type of tax-refund scam), it pushes an immediate signature update to all enterprise partners. This provides \"collective immunity,\" preventing the scam from spreading to a second bank once it's detected at the first.</li><li><strong>Network Hygiene:</strong> Identifying \"Top Phone Numbers\" allows Telcos to neutralize high-volume \"A-Parties\" that are responsible for millions of automated pings, cleaning up the national network.</li></ul>"
  },
  {
    "question": "How does SIM Swap intelligence protect my bank account?",
    "answer": "<p>SIM Swapping is the final step in an Account Takeover (ATO), where a fraudster steals your phone number to intercept bank OTPs.</p><ul><li><strong>Critical Warning:</strong> WTI monitors for unauthorized SIM replacements and treats them as a high-risk signal.</li><li><strong>The \"Safety Lock\":</strong> When a SIM swap is detected, WTI can trigger a 24-hour \"cooling-off period\" where high-value banking transactions or password resets are automatically restricted until a biometric liveness check is performed.</li></ul>"
  }
] as const;
