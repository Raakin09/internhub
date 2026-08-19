'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/utils';
const translations = {
  en: {
    nav: { internships: 'Internships', jobs: 'Jobs', courses: 'Courses', publicSpace: 'Public Space', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout', profile: 'Profile', settings: 'Settings' },
    home: { title: 'Find Your Dream Internship', subtitle: 'Discover thousands of internship & job opportunities from top companies worldwide', searchPlaceholder: 'Search internships, jobs, companies...', browse: 'Browse Internships', browseJobs: 'Browse Jobs', featured: 'Featured Opportunities', categories: 'Explore Categories', stats: { internships: 'Internships', companies: 'Companies', students: 'Students', placements: 'Placements' } },
    common: { apply: 'Apply Now', viewDetails: 'View Details', loading: 'Loading...', noResults: 'No results found', search: 'Search', filter: 'Filter', sort: 'Sort', all: 'All', save: 'Save', cancel: 'Cancel', submit: 'Submit', delete: 'Delete', edit: 'Edit', back: 'Back', next: 'Next', previous: 'Previous', perMonth: '/month', remote: 'Remote', hybrid: 'Hybrid', office: 'Office', ppo: 'PPO Available' },
    auth: { loginTitle: 'Welcome Back', loginSubtitle: 'Sign in to your InternHub account', registerTitle: 'Create Account', registerSubtitle: 'Join thousands of students finding their dream internships', forgotPassword: 'Forgot Password?', rememberMe: 'Remember me', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', signUp: 'Sign Up', signIn: 'Sign In' },
    dashboard: { overview: 'Overview', applications: 'My Applications', profile: 'Profile', resumeBuilder: 'Resume Builder', subscription: 'Subscription', loginHistory: 'Login History', settings: 'Settings' },
    subscription: { title: 'Choose Your Plan', subtitle: 'Unlock more opportunities with premium plans', free: 'Free', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', currentPlan: 'Current Plan', upgrade: 'Upgrade', popular: 'Most Popular' },
  },
  es: {
    nav: { internships: 'Prácticas', jobs: 'Empleos', courses: 'Cursos', publicSpace: 'Espacio Público', login: 'Iniciar Sesión', register: 'Registrarse', dashboard: 'Panel', logout: 'Cerrar Sesión', profile: 'Perfil', settings: 'Configuración' },
    home: { title: 'Encuentra Tu Práctica Soñada', subtitle: 'Descubre miles de oportunidades de prácticas y empleo de las mejores empresas del mundo', searchPlaceholder: 'Buscar prácticas, empleos, empresas...', browse: 'Ver Prácticas', browseJobs: 'Ver Empleos', featured: 'Oportunidades Destacadas', categories: 'Explorar Categorías', stats: { internships: 'Prácticas', companies: 'Empresas', students: 'Estudiantes', placements: 'Colocaciones' } },
    common: { apply: 'Aplicar Ahora', viewDetails: 'Ver Detalles', loading: 'Cargando...', noResults: 'Sin resultados', search: 'Buscar', filter: 'Filtrar', sort: 'Ordenar', all: 'Todos', save: 'Guardar', cancel: 'Cancelar', submit: 'Enviar', delete: 'Eliminar', edit: 'Editar', back: 'Atrás', next: 'Siguiente', previous: 'Anterior', perMonth: '/mes', remote: 'Remoto', hybrid: 'Híbrido', office: 'Oficina', ppo: 'PPO Disponible' },
    auth: { loginTitle: 'Bienvenido de Nuevo', loginSubtitle: 'Inicia sesión en tu cuenta de InternHub', registerTitle: 'Crear Cuenta', registerSubtitle: 'Únete a miles de estudiantes encontrando sus prácticas soñadas', forgotPassword: '¿Olvidaste tu Contraseña?', rememberMe: 'Recuérdame', noAccount: '¿No tienes una cuenta?', hasAccount: '¿Ya tienes una cuenta?', signUp: 'Registrarse', signIn: 'Iniciar Sesión' },
    dashboard: { overview: 'Resumen', applications: 'Mis Aplicaciones', profile: 'Perfil', resumeBuilder: 'Generador de CV', subscription: 'Suscripción', loginHistory: 'Historial de Acceso', settings: 'Configuración' },
    subscription: { title: 'Elige Tu Plan', subtitle: 'Desbloquea más oportunidades con planes premium', free: 'Gratis', bronze: 'Bronce', silver: 'Plata', gold: 'Oro', currentPlan: 'Plan Actual', upgrade: 'Mejorar', popular: 'Más Popular' },
  },
  hi: {
    nav: { internships: 'इंटर्नशिप', jobs: 'नौकरियाँ', courses: 'कोर्स', publicSpace: 'पब्लिक स्पेस', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', logout: 'लॉगआउट', profile: 'प्रोफाइल', settings: 'सेटिंग्स' },
    home: { title: 'अपनी सपनों की इंटर्नशिप खोजें', subtitle: 'दुनिया भर की शीर्ष कंपनियों से हजारों इंटर्नशिप और नौकरी के अवसर खोजें', searchPlaceholder: 'इंटर्नशिप, नौकरियाँ, कंपनियाँ खोजें...', browse: 'इंटर्नशिप देखें', browseJobs: 'नौकरियाँ देखें', featured: 'विशेष अवसर', categories: 'श्रेणियाँ देखें', stats: { internships: 'इंटर्नशिप', companies: 'कंपनियाँ', students: 'छात्र', placements: 'प्लेसमेंट' } },
    common: { apply: 'अभी आवेदन करें', viewDetails: 'विवरण देखें', loading: 'लोड हो रहा है...', noResults: 'कोई परिणाम नहीं', search: 'खोजें', filter: 'फिल्टर', sort: 'क्रमबद्ध', all: 'सभी', save: 'सहेजें', cancel: 'रद्द करें', submit: 'जमा करें', delete: 'हटाएं', edit: 'संपादित', back: 'वापस', next: 'अगला', previous: 'पिछला', perMonth: '/माह', remote: 'रिमोट', hybrid: 'हाइब्रिड', office: 'ऑफिस', ppo: 'PPO उपलब्ध' },
    auth: { loginTitle: 'वापसी पर स्वागत', loginSubtitle: 'अपने InternHub खाते में साइन इन करें', registerTitle: 'खाता बनाएं', registerSubtitle: 'हजारों छात्रों से जुड़ें जो अपनी सपनों की इंटर्नशिप खोज रहे हैं', forgotPassword: 'पासवर्ड भूल गए?', rememberMe: 'मुझे याद रखें', noAccount: 'खाता नहीं है?', hasAccount: 'पहले से खाता है?', signUp: 'साइन अप', signIn: 'साइन इन' },
    dashboard: { overview: 'अवलोकन', applications: 'मेरे आवेदन', profile: 'प्रोफाइल', resumeBuilder: 'रिज़्यूमे बिल्डर', subscription: 'सदस्यता', loginHistory: 'लॉगिन इतिहास', settings: 'सेटिंग्स' },
    subscription: { title: 'अपना प्लान चुनें', subtitle: 'प्रीमियम प्लान से और अवसर पाएं', free: 'फ्री', bronze: 'ब्रॉन्ज़', silver: 'सिल्वर', gold: 'गोल्ड', currentPlan: 'वर्तमान प्लान', upgrade: 'अपग्रेड', popular: 'सबसे लोकप्रिय' },
  },
  pt: {
    nav: { internships: 'Estágios', jobs: 'Empregos', courses: 'Cursos', publicSpace: 'Espaço Público', login: 'Entrar', register: 'Cadastrar', dashboard: 'Painel', logout: 'Sair', profile: 'Perfil', settings: 'Configurações' },
    home: { title: 'Encontre Seu Estágio dos Sonhos', subtitle: 'Descubra milhares de oportunidades de estágio e emprego das melhores empresas do mundo', searchPlaceholder: 'Buscar estágios, empregos, empresas...', browse: 'Ver Estágios', browseJobs: 'Ver Empregos', featured: 'Oportunidades em Destaque', categories: 'Explorar Categorias', stats: { internships: 'Estágios', companies: 'Empresas', students: 'Estudantes', placements: 'Colocações' } },
    common: { apply: 'Candidatar-se', viewDetails: 'Ver Detalhes', loading: 'Carregando...', noResults: 'Nenhum resultado', search: 'Buscar', filter: 'Filtrar', sort: 'Ordenar', all: 'Todos', save: 'Salvar', cancel: 'Cancelar', submit: 'Enviar', delete: 'Excluir', edit: 'Editar', back: 'Voltar', next: 'Próximo', previous: 'Anterior', perMonth: '/mês', remote: 'Remoto', hybrid: 'Híbrido', office: 'Escritório', ppo: 'PPO Disponível' },
    auth: { loginTitle: 'Bem-vindo de Volta', loginSubtitle: 'Entre na sua conta InternHub', registerTitle: 'Criar Conta', registerSubtitle: 'Junte-se a milhares de estudantes encontrando seus estágios dos sonhos', forgotPassword: 'Esqueceu a Senha?', rememberMe: 'Lembrar-me', noAccount: 'Não tem uma conta?', hasAccount: 'Já tem uma conta?', signUp: 'Cadastrar', signIn: 'Entrar' },
    dashboard: { overview: 'Visão Geral', applications: 'Minhas Candidaturas', profile: 'Perfil', resumeBuilder: 'Gerador de Currículo', subscription: 'Assinatura', loginHistory: 'Histórico de Login', settings: 'Configurações' },
    subscription: { title: 'Escolha Seu Plano', subtitle: 'Desbloqueie mais oportunidades com planos premium', free: 'Grátis', bronze: 'Bronze', silver: 'Prata', gold: 'Ouro', currentPlan: 'Plano Atual', upgrade: 'Atualizar', popular: 'Mais Popular' },
  },
  zh: {
    nav: { internships: '实习', jobs: '工作', courses: '课程', publicSpace: '公共空间', login: '登录', register: '注册', dashboard: '仪表板', logout: '退出', profile: '个人资料', settings: '设置' },
    home: { title: '找到你梦想的实习', subtitle: '从全球顶级公司发现数千个实习和工作机会', searchPlaceholder: '搜索实习、工作、公司...', browse: '浏览实习', browseJobs: '浏览工作', featured: '精选机会', categories: '探索类别', stats: { internships: '实习', companies: '公司', students: '学生', placements: '就业' } },
    common: { apply: '立即申请', viewDetails: '查看详情', loading: '加载中...', noResults: '没有结果', search: '搜索', filter: '筛选', sort: '排序', all: '全部', save: '保存', cancel: '取消', submit: '提交', delete: '删除', edit: '编辑', back: '返回', next: '下一个', previous: '上一个', perMonth: '/月', remote: '远程', hybrid: '混合', office: '办公室', ppo: 'PPO可用' },
    auth: { loginTitle: '欢迎回来', loginSubtitle: '登录您的InternHub帐户', registerTitle: '创建帐户', registerSubtitle: '加入数千名正在寻找梦想实习的学生', forgotPassword: '忘记密码？', rememberMe: '记住我', noAccount: '没有帐户？', hasAccount: '已有帐户？', signUp: '注册', signIn: '登录' },
    dashboard: { overview: '概览', applications: '我的申请', profile: '个人资料', resumeBuilder: '简历生成器', subscription: '订阅', loginHistory: '登录历史', settings: '设置' },
    subscription: { title: '选择你的计划', subtitle: '通过高级计划解锁更多机会', free: '免费', bronze: '铜牌', silver: '银牌', gold: '金牌', currentPlan: '当前计划', upgrade: '升级', popular: '最受欢迎' },
  },
  fr: {
    nav: { internships: 'Stages', jobs: 'Emplois', courses: 'Cours', publicSpace: 'Espace Public', login: 'Connexion', register: "S'inscrire", dashboard: 'Tableau de Bord', logout: 'Déconnexion', profile: 'Profil', settings: 'Paramètres' },
    home: { title: 'Trouvez Votre Stage de Rêve', subtitle: "Découvrez des milliers d'opportunités de stage et d'emploi dans les meilleures entreprises du monde", searchPlaceholder: 'Rechercher stages, emplois, entreprises...', browse: 'Voir les Stages', browseJobs: 'Voir les Emplois', featured: 'Opportunités en Vedette', categories: 'Explorer les Catégories', stats: { internships: 'Stages', companies: 'Entreprises', students: 'Étudiants', placements: 'Placements' } },
    common: { apply: 'Postuler', viewDetails: 'Voir les Détails', loading: 'Chargement...', noResults: 'Aucun résultat', search: 'Rechercher', filter: 'Filtrer', sort: 'Trier', all: 'Tous', save: 'Enregistrer', cancel: 'Annuler', submit: 'Soumettre', delete: 'Supprimer', edit: 'Modifier', back: 'Retour', next: 'Suivant', previous: 'Précédent', perMonth: '/mois', remote: 'Télétravail', hybrid: 'Hybride', office: 'Bureau', ppo: 'PPO Disponible' },
    auth: { loginTitle: 'Bon Retour', loginSubtitle: 'Connectez-vous à votre compte InternHub', registerTitle: 'Créer un Compte', registerSubtitle: 'Rejoignez des milliers d\'étudiants qui trouvent leur stage de rêve', forgotPassword: 'Mot de Passe Oublié ?', rememberMe: 'Se souvenir de moi', noAccount: "Pas de compte ?", hasAccount: 'Déjà un compte ?', signUp: "S'inscrire", signIn: 'Se Connecter' },
    dashboard: { overview: 'Aperçu', applications: 'Mes Candidatures', profile: 'Profil', resumeBuilder: 'Créateur de CV', subscription: 'Abonnement', loginHistory: 'Historique de Connexion', settings: 'Paramètres' },
    subscription: { title: 'Choisissez Votre Plan', subtitle: "Débloquez plus d'opportunités avec les plans premium", free: 'Gratuit', bronze: 'Bronze', silver: 'Argent', gold: 'Or', currentPlan: 'Plan Actuel', upgrade: 'Mettre à Niveau', popular: 'Le Plus Populaire' },
  },
};
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [otpRequired, setOtpRequired] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem('internhub_lang');
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);
  const setLanguage = useCallback((langCode) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (lang?.requiresOTP) {
      setPendingLanguage(langCode);
      setOtpRequired(true);
      return { requiresOTP: true };
    }
    setLanguageState(langCode);
    localStorage.setItem('internhub_lang', langCode);
    return { requiresOTP: false };
  }, []);
  const confirmLanguageChange = useCallback(() => {
    if (pendingLanguage) {
      setLanguageState(pendingLanguage);
      localStorage.setItem('internhub_lang', pendingLanguage);
      setPendingLanguage(null);
      setOtpRequired(false);
    }
  }, [pendingLanguage]);
  const cancelLanguageChange = useCallback(() => {
    setPendingLanguage(null);
    setOtpRequired(false);
  }, []);
  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key; 
        }
      }
      return value || key;
    },
    [language]
  );
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        otpRequired,
        pendingLanguage,
        confirmLanguageChange,
        cancelLanguageChange,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
