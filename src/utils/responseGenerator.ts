import { toast } from "@/hooks/use-toast";

// Generate structured responses based on user query and language
export const generateStructuredResponse = (query: string, detectedLanguage: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Basic response templates for different languages
  const responseTemplates: Record<string, Record<string, string>> = {
    "English": {
      medicine: `### Medicine Information\n\n1. **Donation Process**:\n   - Medicines must be unexpired\n   - Original packaging required\n   - Minimum 3 months before expiry\n\n2. **How to Donate**:\n   - Use our donor portal\n   - Schedule a pickup\n   - Drop at collection centers`,
      ngo: `### NGO Partnerships\n\n1. **Benefits**:\n   - Access to medicine inventory\n   - Distribution infrastructure\n   - Analytics dashboard\n\n2. **Requirements**:\n   - Registered NGO status\n   - Healthcare focus\n   - Operational for at least 1 year`,
      donate: `### Donation Information\n\n1. **What You Can Donate**:\n   - Unopened medications\n   - Medical equipment\n   - Healthcare supplies\n\n2. **Process**:\n   - Register as donor\n   - List available items\n   - Arrange delivery/pickup`,
      recipient: `### Recipient Information\n\n1. **Eligibility**:\n   - Verified individuals\n   - Healthcare facilities\n   - Registered NGOs\n\n2. **Process**:\n   - Submit application\n   - Provide documentation\n   - Receive approval`,
      default: `I'll be happy to help with your query about "${query}". Here's what you might want to know:\n\n1. **MediShare Platform**:\n   - Connects medicine donors with recipients\n   - Ensures safe and compliant transfers\n   - Tracks impact and distribution\n\n2. **How to Get Started**:\n   - Register on our platform\n   - Complete verification\n   - Start donating or requesting medicines`
    },
    "Hindi": {
      medicine: `### दवा जानकारी\n\n1. **दान प्रक्रिया**:\n   - दवाएं अवश्य अनएक्सपायर्ड होनी चाहिए\n   - मूल पैकेजिंग आवश्यक है\n   - समाप्ति से पहले कम से कम 3 महीने\n\n2. **दान कैसे करें**:\n   - हमारे दाता पोर्टल का उपयोग करें\n   - पिकअप शेड्यूल करें\n   - संग्रह केंद्रों पर ड्रॉप करें`,
      ngo: `### NGO साझेदारी\n\n1. **लाभ**:\n   - दवा इन्वेंटरी तक पहुंच\n   - वितरण बुनियादी ढांचा\n   - एनालिटिक्स डैशबोर्ड\n\n2. **आवश्यकताएँ**:\n   - पंजीकृत NGO स्थिति\n   - स्वास्थ्य देखभाल फोकस\n   - कम से कम 1 वर्ष से संचालन`,
      donate: `### दान जानकारी\n\n1. **आप क्या दान कर सकते हैं**:\n   - अनखुली दवाएं\n   - चिकित्सा उपकरण\n   - स्वास्थ्य देखभाल आपूर्ति\n\n2. **प्रक्रिया**:\n   - दाता के रूप में रजिस्टर करें\n   - उपलब्ध वस्तुओं की सूची बनाएं\n   - डिलीवरी/पिकअप की व्यवस्था करें`,
      recipient: `### प्राप्तकर्ता जानकारी\n\n1. **पात्रता**:\n   - सत्यापित व्यक्ति\n   - स्वास्थ्य सुविधाएं\n   - पंजीकृत NGOs\n\n2. **प्रक्रिया**:\n   - आवेदन जमा करें\n   - दस्तावेज प्रदान करें\n   - अनुमोदन प्राप्त करें`,
      default: `मुझे आपके "${query}" के बारे में प्रश्न में मदद करने में ख़ुशी होगी। यहां आपको क्या जानना चाहिए:\n\n1. **मेडिशेयर प्लेटफॉर्म**:\n   - दवा दाताओं को प्राप्तकर्ताओं से जोड़ता है\n   - सुरक्षित और अनुपालन वाले ट्रांसफर सुनिश्चित करता है\n   - प्रभाव और वितरण को ट्रैक करता है\n\n2. **कैसे शुरू करें**:\n   - हमारे प्लेटफॉर्म पर रजिस्टर करें\n   - सत्यापन पूरा करें\n   - दान देना या दवाइयों का अनुरोध करना शुरू करें`
    },
    "Spanish": {
      medicine: `### Información sobre Medicamentos\n\n1. **Proceso de Donación**:\n   - Los medicamentos no deben estar caducados\n   - Se requiere empaque original\n   - Mínimo 3 meses antes de caducar\n\n2. **Cómo Donar**:\n   - Use nuestro portal de donantes\n   - Programe una recogida\n   - Entregue en centros de recolección`,
      ngo: `### Asociaciones con ONGs\n\n1. **Beneficios**:\n   - Acceso al inventario de medicamentos\n   - Infraestructura de distribución\n   - Panel de análisis\n\n2. **Requisitos**:\n   - Estado de ONG registrada\n   - Enfoque en atención médica\n   - Operativa durante al menos 1 año`,
      donate: `### Información de Donación\n\n1. **Qué Puede Donar**:\n   - Medicamentos sin abrir\n   - Equipos médicos\n   - Suministros sanitarios\n\n2. **Proceso**:\n   - Regístrese como donante\n   - Liste los artículos disponibles\n   - Organice la entrega/recogida`,
      recipient: `### Información para Receptores\n\n1. **Elegibilidad**:\n   - Individuos verificados\n   - Centros de salud\n   - ONGs registradas\n\n2. **Proceso**:\n   - Enviar solicitud\n   - Proporcionar documentación\n   - Recibir aprobación`,
      default: `Estaré encantado de ayudarte con tu consulta sobre "${query}". Aquí tienes lo que podrías querer saber:\n\n1. **Plataforma MediShare**:\n   - Conecta donantes de medicamentos con receptores\n   - Garantiza transferencias seguras y conformes\n   - Realiza seguimiento del impacto y la distribución\n\n2. **Cómo Empezar**:\n   - Regístrese en nuestra plataforma\n   - Complete la verificación\n   - Comience a donar o solicitar medicamentos`
    },
    "French": {
      medicine: `### Informations sur les Médicaments\n\n1. **Processus de Don**:\n   - Les médicaments ne doivent pas être périmés\n   - Emballage d'origine requis\n   - Minimum 3 mois avant expiration\n\n2. **Comment Donner**:\n   - Utilisez notre portail donateur\n   - Planifiez un ramassage\n   - Déposez aux centres de collecte`,
      ngo: `### Partenariats ONG\n\n1. **Avantages**:\n   - Accès à l'inventaire des médicaments\n   - Infrastructure de distribution\n   - Tableau de bord analytique\n\n2. **Exigences**:\n   - Statut d'ONG enregistrée\n   - Focus sur les soins de santé\n   - Opérationnel depuis au moins 1 an`,
      donate: `### Informations sur les Dons\n\n1. **Ce que Vous Pouvez Donner**:\n   - Médicaments non ouverts\n   - Équipement médical\n   - Fournitures de soins de santé\n\n2. **Processus**:\n   - Inscrivez-vous comme donateur\n   - Listez les articles disponibles\n   - Organisez la livraison/collecte`,
      recipient: `### Informations pour les Bénéficiaires\n\n1. **Éligibilité**:\n   - Individus vérifiés\n   - Établissements de santé\n   - ONG enregistrées\n\n2. **Processus**:\n   - Soumettre une demande\n   - Fournir la documentation\n   - Recevoir l'approbation`,
      default: `Je serai heureux de vous aider avec votre question sur "${query}". Voici ce que vous pourriez vouloir savoir:\n\n1. **Plateforme MediShare**:\n   - Connecte les donneurs de médicaments aux bénéficiaires\n   - Assure des transferts sûrs et conformes\n   - Suit l'impact et la distribution\n\n2. **Comment Commencer**:\n   - Inscrivez-vous sur notre plateforme\n   - Complétez la vérification\n   - Commencez à donner ou à demander des médicaments`
    },
    "German": {
      medicine: `### Medikamenteninformationen\n\n1. **Spendenprozess**:\n   - Medikamente dürfen nicht abgelaufen sein\n   - Originalverpackung erforderlich\n   - Mindestens 3 Monate vor Ablauf\n\n2. **Wie man spendet**:\n   - Nutzen Sie unser Spenderportal\n   - Vereinbaren Sie eine Abholung\n   - Abgabe an Sammelstellen`,
      ngo: `### NGO-Partnerschaften\n\n1. **Vorteile**:\n   - Zugang zum Medikamenteninventar\n   - Vertriebsinfrastruktur\n   - Analyse-Dashboard\n\n2. **Anforderungen**:\n   - Registrierter NGO-Status\n   - Fokus auf Gesundheitswesen\n   - Seit mindestens 1 Jahr tätig`,
      donate: `### Spendeninformationen\n\n1. **Was Sie spenden können**:\n   - Ungeöffnete Medikamente\n   - Medizinische Geräte\n   - Gesundheitsversorgungsmittel\n\n2. **Prozess**:\n   - Als Spender registrieren\n   - Verfügbare Artikel auflisten\n   - Lieferung/Abholung organisieren`,
      recipient: `### Empfängerinformationen\n\n1. **Berechtigung**:\n   - Verifizierte Personen\n   - Gesundheitseinrichtungen\n   - Registrierte NGOs\n\n2. **Prozess**:\n   - Antrag einreichen\n   - Dokumentation bereitstellen\n   - Genehmigung erhalten`,
      default: `Ich helfe Ihnen gerne bei Ihrer Anfrage zu "${query}". Hier ist, was Sie wissen möchten:\n\n1. **MediShare-Plattform**:\n   - Verbindet Medikamentenspender mit Empfängern\n   - Gewährleistet sichere und konforme Übertragungen\n   - Verfolgt Wirkung und Verteilung\n\n2. **Wie man beginnt**:\n   - Registrieren Sie sich auf unserer Plattform\n   - Schließen Sie die Verifizierung ab\n   - Beginnen Sie mit dem Spenden oder Anfordern von Medikamenten`
    },
    "Chinese": {
      medicine: `### 药品信息\n\n1. **捐赠流程**:\n   - 药品必须未过期\n   - 需要原包装\n   - 距离到期至少3个月\n\n2. **如何捐赠**:\n   - 使用我们的捐赠者门户\n   - 安排取件\n   - 在收集中心投放`,
      ngo: `### 非政府组织伙伴关系\n\n1. **好处**:\n   - 获取药品库存\n   - 分发基础设施\n   - 分析仪表板\n\n2. **要求**:\n   - 注册的非政府组织状态\n   - 专注于医疗保健\n   - 运营至少1年`,
      donate: `### 捐赠信息\n\n1. **您可以捐赠什么**:\n   - 未开封的药物\n   - 医疗设备\n   - 医疗用品\n\n2. **流程**:\n   - 注册为捐赠者\n   - 列出可用物品\n   - 安排交付/取件`,
      recipient: `### 接收者信息\n\n1. **资格**:\n   - 已验证的个人\n   - 医疗设施\n   - 注册的非政府组织\n\n2. **流程**:\n   - 提交申请\n   - 提供文件\n   - 获得批准`,
      default: `我很乐意帮助您解答关于"${query}"的问题。以下是您可能想了解的内容：\n\n1. **MediShare平台**:\n   - 连接药品捐赠者和接收者\n   - 确保安全和合规的转移\n   - 跟踪影响和分配\n\n2. **如何开始**:\n   - 在我们的平台上注册\n   - 完成验证\n   - 开始捐赠或请求药品`
    },
    "Japanese": {
      medicine: `### 医薬品情報\n\n1. **寄付プロセス**:\n   - 医薬品は期限切れでないこと\n   - 元のパッケージが必要\n   - 有効期限まで最低3ヶ月\n\n2. **寄付方法**:\n   - 寄付者ポータルを使用\n   - 集荷予約\n   - 収集センターに持参`,
      ngo: `### NGOパートナーシップ\n\n1. **メリット**:\n   - 医薬品在庫へのアクセス\n   - 流通インフラ\n   - 分析ダッシュボード\n\n2. **要件**:\n   - 登録済みNGOステータス\n   - ヘルスケアへの注力\n   - 少なくとも1年間の運営`,
      donate: `### 寄付情報\n\n1. **寄付できるもの**:\n   - 未開封の薬\n   - 医療機器\n   - ヘルスケア用品\n\n2. **プロセス**:\n   - 寄付者として登録\n   - 利用可能なアイテムをリスト\n   - 配送/集荷の手配`,
      recipient: `### 受取者情報\n\n1. **資格**:\n   - 確認済み個人\n   - 医療施設\n   - 登録済みNGO\n\n2. **プロセス**:\n   - 申請書を提出\n   - 文書を提供\n   - 承認を受ける`,
      default: `"${query}"に関するお問い合わせをお手伝いします。知りたいことは以下の通りです：\n\n1. **MediShareプラットフォーム**:\n   - 医薬品の寄付者と受取人をつなぐ\n   - 安全で適切な移転を確保\n   - 影響と配布を追跡\n\n2. **始め方**:\n   - プラットフォームに登録\n   - 確認を完了\n   - 医薬品の寄付や要求を開始`
    },
    "Arabic": {
      medicine: `### معلومات الأدوية\n\n1. **عملية التبرع**:\n   - يجب أن تكون الأدوية غير منتهية الصلاحية\n   - العبوة الأصلية مطلوبة\n   - 3 أشهر على الأقل قبل انتهاء الصلاحية\n\n2. **كيفية التبرع**:\n   - استخدم بوابة المتبرعين لدينا\n   - جدولة استلام\n   - التسليم في مراكز التجميع`,
      ngo: `### شراكات المنظمات غير الحكومية\n\n1. **الفوائد**:\n   - الوصول إلى مخزون الأدوية\n   - بنية تحتية للتوزيع\n   - لوحة تحليلات\n\n2. **المتطلبات**:\n   - وضع منظمة غير حكومية مسجلة\n   - التركيز على الرعاية الصحية\n   - تعمل لمدة سنة واحدة على الأقل`,
      donate: `### معلومات التبرع\n\n1. **ما يمكنك التبرع به**:\n   - أدوية غير مفتوحة\n   - معدات طبية\n   - مستلزمات الرعاية الصحية\n\n2. **العملية**:\n   - التسجيل كمتبرع\n   - قائمة العناصر المتاحة\n   - ترتيب التسليم/الاستلام`,
      recipient: `### معلومات المستلم\n\n1. **الأهلية**:\n   - أفراد تم التحقق منهم\n   - مرافق الرعاية الصحية\n   - منظمات غير حكومية مسجلة\n\n2. **العملية**:\n   - تقديم الطلب\n   - تقديم الوثائق\n   - الحصول على الموافقة`,
      default: `يسعدني مساعدتك في استفسارك حول "${query}". إليك ما قد ترغب في معرفته:\n\n1. **منصة ميديشير**:\n   - تربط متبرعي الأدوية بالمستلمين\n   - تضمن عمليات نقل آمنة ومتوافقة\n   - تتبع التأثير والتوزيع\n\n2. **كيفية البدء**:\n   - سجل في منصتنا\n   - أكمل التحقق\n   - ابدأ بالتبرع أو طلب الأدوية`
    },
    "Bengali": {
      medicine: `### ঔষধ তথ্য\n\n1. **দান প্রক্রিয়া**:\n   - ঔষধ অবশ্যই মেয়াদোত্তীর্ণ হওয়া উচিত নয়\n   - মূল প্যাকেজিং প্রয়োজন\n   - মেয়াদ শেষ হওয়ার আগে ন্যূনতম 3 মাস\n\n2. **কিভাবে দান করবেন**:\n   - আমাদের দাতা পোর্টাল ব্যবহার করুন\n   - পিকআপ শিডিউল করুন\n   - সংগ্রহ কেন্দ্রে ড্রপ করুন`,
      ngo: `### এনজিও অংশীদারিত্ব\n\n1. **সুবিধা**:\n   - ঔষধ ইনভেন্টরিতে অ্যাক্সেস\n   - বিতরণ অবকাঠামো\n   - অ্যানালিটিক্স ড্যাশবোর্ড\n\n2. **প্রয়োজনীয়তা**:\n   - নিবন্ধিত এনজিও স্থিতি\n   - স্বাস্থ্যসেবা ফোকাস\n   - কমপক্ষে 1 বছর ধরে পরিচালিত`,
      donate: `### দান তথ্য\n\n1. **আপনি কি দান করতে পারেন**:\n   - অখোলা ঔষধ\n   - চিকিৎসা সরঞ্জাম\n   - স্বাস্থ্যসেবা সরবরাহ\n\n2. **প্রক্রিয়া**:\n   - দাতা হিসাবে নিবন্ধন করুন\n   - উপলব্ধ আইটেমের তালিকা তৈরি করুন\n   - ডেলিভারি/পিকআপ ব্যবস্থা করুন`,
      recipient: `### প্রাপকের তথ্য\n\n1. **যোগ্যতা**:\n   - যাচাইকৃত ব্যক্তি\n   - স্বাস্থ্যসেবা সুবিধা\n   - নিবন্ধিত এনজিও\n\n2. **প্রক্রিয়া**:\n   - আবেদন জমা দিন\n   - ডকুমেন্টেশন প্রদান করুন\n   - অনুমোদন পান`,
      default: `আমি আপনার "${query}" সম্পর্কে প্রশ্নে সাহায্য করতে পেরে খুশি। এখানে আপনি যা জানতে চাইতে পারেন:\n\n1. **মেডিশেয়ার প্ল্যাটফর্ম**:\n   - ঔষধ দাতাদের প্রাপকদের সাথে সংযোগ করে\n   - নিরাপদ এবং সম্মত স্থানান্তর নিশ্চিত করে\n   - প্রভাব এবং বিতরণ ট্র্যাক করে\n\n2. **কিভাবে শুরু করবেন**:\n   - আমাদের প্ল্যাটফর্মে নিবন্ধন করুন\n   - যাচাইকরণ সম্পূর্ণ করুন\n   - ঔষধ দান বা অনুরোধ শুরু করুন`
    },
    "Tamil": {
      medicine: `### மருந்து தகவல்\n\n1. **நன்கொடை செயல்முறை**:\n   - மருந்துகள் காலாவதியாகாமல் இருக்க வேண்டும்\n   - அசல் பேக்கேஜிங் தேவை\n   - காலாவதியாவதற்கு குறைந்தது 3 மாதங்களுக்கு முன்\n\n2. **எப்படி நன்கொடை செய்வது**:\n   - எங்கள் நன்கொடையாளர் போர்டலைப் பயன்படுத்தவும்\n   - பிக்அப் அட்டவணை\n   - சேகரிப்பு மையங்களில் விடவும்`,
      ngo: `### NGO கூட்டாண்மைகள்\n\n1. **நன்மைகள்**:\n   - மருந்து சரக்கு அணுகல்\n   - விநியோக உள்கட்டமைப்பு\n   - பகுப்பாய்வு டாஷ்போர்டு\n\n2. **தேவைகள்**:\n   - பதிவுசெய்யப்பட்ட NGO நிலை\n   - சுகாதார கவனம்\n   - குறைந்தது 1 ஆண்டு செயல்பாடு`,
      donate: `### நன்கொடை தகவல்\n\n1. **நீங்கள் என்ன நன்கொடை செய்யலாம்**:\n   - திறக்கப்படாத மருந்துகள்\n   - மருத்துவ உபகரணங்கள்\n   - சுகாதார பொருட்கள்\n\n2. **செயல்முறை**:\n   - நன்கொடையாளராக பதிவுசெய்யவும்\n   - கிடைக்கும் பொருட்களை பட்டியலிடவும்\n   - டெலிவரி/பிக்அப் ஏற்பாடு செய்யவும்`,
      recipient: `### பெறுநர் தகவல்\n\n1. **தகுதி**:\n   - சரிபார்க்கப்பட்ட தனிநபர்கள்\n   - சுகாதார வசதிகள்\n   - பதிவுசெய்யப்பட்ட NGOகள்\n\n2. **செயல்முறை**:\n   - விண்ணப்பத்தை சமர்ப்பிக்கவும்\n   - ஆவணங்களை வழங்கவும்\n   - ஒப்புதல் பெறவும்`,
      default: `உங்கள் "${query}" பற்றிய கேள்விக்கு உதவ மகிழ்ச்சியடைகிறேன். நீங்கள் அறிய விரும்புவது இங்கே:\n\n1. **மெடிஷேர் தளம்**:\n   - மருந்து நன்கொடையாளர்களை பெறுநர்களுடன் இணைக்கிறது\n   - பாதுகாப்பான மற்றும் இணக்கமான பரிமாற்றங்களை உறுதிசெய்கிறது\n   - தாக்கம் மற்றும் விநியோகத்தை கண்காணிக்கிறது\n\n2. **எப்படி தொடங்குவது**:\n   - எங்கள் தளத்தில் பதிவுசெய்யவும்\n   - சரிபார்ப்பை முடிக்கவும்\n   - மருந்துகளை நன்கொடை செய்ய அல்லது கோர தொடங்கவும்`
    }
  };
  
  // Determine response language - use detectedLanguage if we have templates for it, 
  // otherwise default to English
  const responseLanguage = responseTemplates[detectedLanguage] ? detectedLanguage : "English";
  const languageResponses = responseTemplates[responseLanguage];
  
  // Match query to appropriate response template
  if (lowerQuery.includes("medicine") || lowerQuery.includes("medication") || 
      lowerQuery.includes("दवा") || lowerQuery.includes("औषधि") ||
      lowerQuery.includes("medicamento") || lowerQuery.includes("médicament") ||
      lowerQuery.includes("medikament") || lowerQuery.includes("薬") ||
      lowerQuery.includes("药品") || lowerQuery.includes("دواء") ||
      lowerQuery.includes("ঔষধ") || lowerQuery.includes("மருந்து")) {
    return languageResponses.medicine;
  } 
  else if (lowerQuery.includes("ngo") || lowerQuery.includes("organization") || 
           lowerQuery.includes("संगठन") || lowerQuery.includes("संस्था") ||
           lowerQuery.includes("organización") || lowerQuery.includes("organisation") ||
           lowerQuery.includes("organisation") || lowerQuery.includes("組織") ||
           lowerQuery.includes("组织") || lowerQuery.includes("منظمة") ||
           lowerQuery.includes("সংগঠন") || lowerQuery.includes("அமைப்பு")) {
    return languageResponses.ngo;
  }
  else if (lowerQuery.includes("donate") || lowerQuery.includes("donation") || 
           lowerQuery.includes("दान") || lowerQuery.includes("देना") ||
           lowerQuery.includes("donar") || lowerQuery.includes("donner") ||
           lowerQuery.includes("spenden") || lowerQuery.includes("寄付") ||
           lowerQuery.includes("捐赠") || lowerQuery.includes("تبرع") ||
           lowerQuery.includes("দান") || lowerQuery.includes("நன்கொடை")) {
    return languageResponses.donate;
  }
  else if (lowerQuery.includes("recipient") || lowerQuery.includes("receive") || 
           lowerQuery.includes("प्राप्तकर्ता") || lowerQuery.includes("प्राप्त") ||
           lowerQuery.includes("destinatario") || lowerQuery.includes("recibir") ||
           lowerQuery.includes("bénéficiaire") || lowerQuery.includes("recevoir") ||
           lowerQuery.includes("empfänger") || lowerQuery.includes("erhalten") ||
           lowerQuery.includes("受取人") || lowerQuery.includes("受け取る") ||
           lowerQuery.includes("接收者") || lowerQuery.includes("接收") ||
           lowerQuery.includes("متلقي") || lowerQuery.includes("استلام") ||
           lowerQuery.includes("প্রাপক") || lowerQuery.includes("পেতে") ||
           lowerQuery.includes("பெறுநர்") || lowerQuery.includes("பெற")) {
    return languageResponses.recipient;
  }
  else {
    return languageResponses.default;
  }
};

export const getLocalizedText = (text: string, currentLanguage: string): string => {
  // This is a simple implementation. In a production app, use a proper i18n library
  const localizations: Record<string, Record<string, string>> = {
    "Hindi": {
      "Voice recognition error": "आवाज पहचान त्रुटि",
      "Failed to recognize your voice. Please try again or use text input.": "आपकी आवाज को पहचानने में विफल रहा। कृपया पुनः प्रयास करें या टेक्स्ट इनपुट का उपयोग करें।",
      "Voice feature unavailable": "वॉयस फीचर अनुपलब्ध",
      "Your browser doesn't support voice recognition. Please use text input instead.": "आपका ब्राउज़र वॉयस पहचान का समर्थन नहीं करता है। कृपया टेक्स्ट इनपुट का उपयोग करें।",
      "AI Assistant": "AI सहायक",
      "Type your message...": "अपना संदेश लिखें...",
      "Clear chat": "चैट साफ करें",
      "Enable voice": "वॉयस सक्षम करें",
      "Disable voice": "वॉयस अक्षम करें",
      "Start listening": "सुनना शुरू करें",
      "Stop listening": "सुनना बंद करें",
      "Send message": "संदेश भेजें",
      "Speech synthesis error": "वाक् संश्लेषण त्रुटि",
      "Failed to convert text to speech.": "टेक्स्ट को स्पीच में बदलने में विफल।",
      "Text-to-speech unavailable": "टेक्स्ट-टू-स्पीच अनुपलब्ध",
      "Your browser doesn't support text-to-speech.": "आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता है।",
      "Change Language": "भाषा बदलें",
      "Hello! I'm your AI assistant. How can I help you today?": "नमस्ते! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"
    },
    "Spanish": {
      "Voice recognition error": "Error de reconocimiento de voz",
      "Failed to recognize your voice. Please try again or use text input.": "No se pudo reconocer tu voz. Inténtalo de nuevo o utiliza la entrada de texto.",
      "Voice feature unavailable": "Función de voz no disponible",
      "Your browser doesn't support voice recognition. Please use text input instead.": "Tu navegador no admite el reconocimiento de voz. Utiliza la entrada de texto en su lugar.",
      "AI Assistant": "Asistente de IA",
      "Type your message...": "Escribe tu mensaje...",
      "Clear chat": "Borrar chat",
      "Enable voice": "Habilitar voz",
      "Disable voice": "Deshabilitar voz",
      "Start listening": "Comenzar a escuchar",
      "Stop listening": "Dejar de escuchar",
      "Send message": "Enviar mensaje",
      "Speech synthesis error": "Error de síntesis de voz",
      "Failed to convert text to speech.": "No se pudo convertir el texto a voz.",
      "Text-to-speech unavailable": "Texto a voz no disponible",
      "Your browser doesn't support text-to-speech.": "Tu navegador no admite la conversión de texto a voz.",
      "Change Language": "Cambiar idioma",
      "Hello! I'm your AI assistant. How can I help you today?": "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?"
    },
    "French": {
      "Voice recognition error": "Erreur de reconnaissance vocale",
      "Failed to recognize your voice. Please try again or use text input.": "Impossible de reconnaître votre voix. Veuillez réessayer ou utiliser la saisie de texte.",
      "Voice feature unavailable": "Fonctionnalité vocale indisponible",
      "Your browser doesn't support voice recognition. Please use text input instead.": "Votre navigateur ne prend pas en charge la reconnaissance vocale. Veuillez utiliser la saisie de texte à la place.",
      "AI Assistant": "Assistant IA",
      "Type your message...": "Tapez votre message...",
      "Clear chat": "Effacer la conversation",
      "Enable voice": "Activer la voix",
      "Disable voice": "Désactiver la voix",
      "Start listening": "Commencer à écouter",
      "Stop listening": "Arrêter d'écouter",
      "Send message": "Envoyer le message",
      "Speech synthesis error": "Erreur de synthèse vocale",
      "Failed to convert text to speech.": "Échec de la conversion du texte en parole.",
      "Text-to-speech unavailable": "Synthèse vocale indisponible",
      "Your browser doesn't support text-to-speech.": "Votre navigateur ne prend pas en charge la synthèse vocale.",
      "Change Language": "Changer de langue",
      "Hello! I'm your AI assistant. How can I help you today?": "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?"
    },
    "German": {
      "Voice recognition error": "Spracherkennungsfehler",
      "Failed to recognize your voice. Please try again or use text input.": "Ihre Stimme konnte nicht erkannt werden. Bitte versuchen Sie es erneut oder verwenden Sie die Texteingabe.",
      "Voice feature unavailable": "Sprachfunktion nicht verfügbar",
      "Your browser doesn't support voice recognition. Please use text input instead.": "Ihr Browser unterstützt keine Spracherkennung. Bitte verwenden Sie stattdessen die Texteingabe.",
      "AI Assistant": "KI-Assistent",
      "Type your message...": "Geben Sie Ihre Nachricht ein...",
      "Clear chat": "Chat löschen",
      "Enable voice": "Sprache aktivieren",
      "Disable voice": "Sprache deaktivieren",
      "Start listening": "Zuhören starten",
      "Stop listening": "Zuhören beenden",
      "Send message": "Nachricht senden",
      "Speech synthesis error": "Sprachsynthesefehler",
      "Failed to convert text to speech.": "Text konnte nicht in Sprache umgewandelt werden.",
      "Text-to-speech unavailable": "Text-zu-Sprache nicht verfügbar",
      "Your browser doesn't support text-to-speech.": "Ihr Browser unterstützt keine Text-zu-Sprache-Umwandlung.",
      "Change Language": "Sprache ändern",
      "Hello! I'm your AI assistant. How can I help you today?": "Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?"
    },
    "Chinese": {
      "Voice recognition error": "语音识别错误",
      "Failed to recognize your voice. Please try again or use text input.": "无法识别您的声音。请重试或使用文本输入。",
      "Voice feature unavailable": "语音功能不可用",
      "Your browser doesn't support voice recognition. Please use text input instead.": "您的浏览器不支持语音识别。请改用文本输入。",
      "AI Assistant": "AI 助手",
      "Type your message...": "输入您的消息...",
      "Clear chat": "清除聊天",
      "Enable voice": "启用语音",
      "Disable voice": "禁用语音",
      "Start listening": "开始聆听",
      "Stop listening": "停止聆听",
      "Send message": "发送消息",
      "Speech synthesis error": "语音合成错误",
      "Failed to convert text to speech.": "无法将文本转换为语音。",
      "Text-to-speech unavailable": "文本转语音不可用",
      "Your browser doesn't support text-to-speech.": "您的浏览器不支持文本转语音。",
      "Change Language": "更改语言",
      "Hello! I'm your AI assistant. How can I help you today?": "你好！我是你的 AI 助手。今天我能帮你什么忙？"
    },
    "Japanese": {
      "Voice recognition error": "音声認識エラー",
      "Failed to recognize your voice. Please try again or use text input.": "音声を認識できませんでした。もう一度お試しいただくか、テキスト入力をご利用ください。",
      "Voice feature unavailable": "音声機能が利用できません",
      "Your browser doesn't support voice recognition. Please use text input instead.": "お使いのブラウザは音声認識をサポートしていません。代わりにテキスト入力をご利用ください。",
      "AI Assistant": "AIアシスタント",
      "Type your message...": "メッセージを入力してください...",
      "Clear chat": "チャットをクリア",
      "Enable voice": "音声を有効にする",
      "Disable voice": "音声を無効にする",
      "Start listening": "聞き取りを開始",
      "Stop listening": "聞き取りを停止",
      "Send message": "メッセージを送信",
      "Speech synthesis error": "音声合成エラー",
      "Failed to convert text to speech.": "テキストを音声に変換できませんでした。",
      "Text-to-speech unavailable": "テキスト読み上げが利用できません",
      "Your browser doesn't support text-to-speech.": "お使いのブラウザはテキスト読み上げをサポートしていません。",
      "Change Language": "言語を変更",
      "Hello! I'm your AI assistant. How can I help you today?": "こんにちは！私はあなたのAIアシスタントです。今日はどのようにお手伝いできますか？"
    },
    "Arabic": {
      "Voice recognition error": "خطأ في التعرف على الصوت",
      "Failed to recognize your voice. Please try again or use text input.": "فشل في التعرف على صوتك. يرجى المحاولة مرة أخرى أو استخدام إدخال النص.",
      "Voice feature unavailable": "ميزة الصوت غير متوفرة",
      "Your browser doesn't support voice recognition. Please use text input instead.": "متصفحك لا يدعم التعرف على الصوت. يرجى استخدام إدخال النص بدلاً من ذلك.",
      "AI Assistant": "مساعد الذكاء الاصطناعي",
      "Type your message...": "اكتب رسالتك...",
      "Clear chat": "مسح المحادثة",
      "Enable voice": "تمكين الصوت",
      "Disable voice": "تعطيل الصوت",
      "Start listening": "بدء الاستماع",
      "Stop listening": "إيقاف الاستماع",
      "Send message": "إرسال الرسالة",
      "Speech synthesis error": "خطأ في تركيب الكلام",
      "Failed to convert text to speech.": "فشل في تحويل النص إلى كلام.",
      "Text-to-speech unavailable": "تحويل النص إلى كلام غير متوفر",
      "Your browser doesn't support text-to-speech.": "متصفحك لا يدعم تحويل النص إلى كلام.",
      "Change Language": "تغيير اللغة",
      "Hello! I'm your AI assistant. How can I help you today?": "مرحبًا! أنا مساعدك الذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟"
    },
    "Bengali": {
      "Voice recognition error": "কণ্ঠস্বর স্বীকৃতি ত্রুটি",
      "Failed to recognize your voice. Please try again or use text input.": "আপনার কণ্ঠস্বর চিনতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা টেক্সট ইনপুট ব্যবহার করুন।",
      "Voice feature unavailable": "কণ্ঠস্বর বৈশিষ্ট্য অনুপলব্ধ",
      "Your browser doesn't support voice recognition. Please use text input instead.": "আপনার ব্রাউজার ভয়েস রিকগনিশন সমর্থন করে না। অনুগ্রহ করে এর পরিবর্তে টেক্সট ইনপুট ব্যবহার করুন।",
      "AI Assistant": "AI সহকারী",
      "Type your message...": "আপনার বার্তা টাইপ করুন...",
      "Clear chat": "চ্যাট পরিষ্কার করুন",
      "Enable voice": "ভয়েস সক্ষম করুন",
      "Disable voice": "ভয়েস অক্ষম করুন",
      "Start listening": "শোনা শুরু করুন",
      "Stop listening": "শোনা বন্ধ করুন",
      "Send message": "বার্তা পাঠান",
      "Speech synthesis error": "স্পিচ সিনথেসিস ত্রুটি",
      "Failed to convert text to speech.": "টেক্সট থেকে স্পিচে রূপান্তর করতে ব্যর্থ হয়েছে।",
      "Text-to-speech unavailable": "টেক্সট-টু-স্পিচ অনুপলব্ধ",
      "Your browser doesn't support text-to-speech.": "আপনার ব্রাউজার টেক্সট-টু-স্পিচ সমর্থন করে না।",
      "Change Language": "ভাষা পরিবর্তন করুন",
      "Hello! I'm your AI assistant. How can I help you today?": "হ্যালো! আমি আপনার AI সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
    },
    "Tamil": {
      "Voice recognition error": "குரல் அங்கீகார பிழை",
      "Failed to recognize your voice. Please try again or use text input.": "உங்கள் குரலை அங்கீகரிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது உரை உள்ளீட்டைப் பயன்படுத்தவும்.",
      "Voice feature unavailable": "குரல் அம்சம் கிடைக்கவில்லை",
      "Your browser doesn't support voice recognition. Please use text input instead.": "உங்கள் உலாவி குரல் அங்கீகாரத்தை ஆதரிக்கவில்லை. அதற்கு பதிலாக உரை உள்ளீட்டைப் பயன்படுத்தவும்.",
      "AI Assistant": "AI உதவியாளர்",
      "Type your message...": "உங்கள் செய்தியைத் தட்டச்சு செய்யவும்...",
      "Clear chat": "அரட்டையை அழிக்கவும்",
      "Enable voice": "குரலை இயக்கு",
      "Disable voice": "குரலை முடக்கு",
      "Start listening": "கேட்கத் தொடங்கு",
      "Stop listening": "கேட்பதை நிறுத்து",
      "Send message": "செய்தி அனுப்பு",
      "Speech synthesis error": "பேச்சு உருவாக்க பிழை",
      "Failed to convert text to speech.": "உரையை பேச்சாக மாற்ற முடியவில்லை.",
      "Text-to-speech unavailable": "உரை-இருந்து-பேச்சு கிடைக்கவில்லை",
      "Your browser doesn't support text-to-speech.": "உங்கள் உலாவி உரை-இருந்து-பேச்சு ஆதரிக்கவில்லை.",
      "Change Language": "மொழியை மாற்று",
      "Hello! I'm your AI assistant. How can I help you today?": "வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
    }
  };
  
  return localizations[currentLanguage]?.[text] || text;
};

// Get welcome message based on language
export const getWelcomeMessage = (language: string): string => {
  const welcomeMessages: Record<string, string> = {
    "English": "Hello! I'm your AI assistant. How can I help you today?",
    "Hindi": "नमस्ते! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    "Spanish": "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?",
    "French": "Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui?",
    "German": "Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?",
    "Chinese": "你好！我是你的 AI 助手。今天我能帮你什么忙？",
    "Japanese": "こんにちは！私はあなたのAIアシスタントです。今日はどのようにお手伝いできますか？",
    "Arabic": "مرحبًا! أنا مساعدك الذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟",
    "Bengali": "হ্যালো! আমি আপনার AI সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    "Tamil": "வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
  };
  
  return welcomeMessages[language] || welcomeMessages["English"];
};
