import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      // Common
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Guardar",
        edit: "Editar",
        delete: "Eliminar",
        view: "Ver",
        back: "Volver",
        next: "Siguiente",
        previous: "Anterior",
        search: "Buscar",
        filter: "Filtrar",
        clear: "Limpiar",
        expand: "Expandir",
        collapse: "Contraer",
      },

      // Navigation
      nav: {
        dashboard: "Dashboard",
        projects: "Proyectos",
        trainings: "Capacitaciones",
        profile: "Perfil",
        settings: "Configuración",
        logout: "Cerrar Sesión",
      },

      // Auth
      auth: {
        login: "Iniciar Sesión",
        register: "Registrarse",
        email: "Correo Electrónico",
        password: "Contraseña",
        name: "Nombre",
        organization: "Organización",
        role: "Rol",
        forgotPassword: "¿Olvidaste tu contraseña?",
        noAccount: "¿No tienes cuenta?",
        haveAccount: "¿Ya tienes cuenta?",
        loginSuccess: "Inicio de sesión exitoso",
        registerSuccess: "Registro exitoso",
        loginError: "Error al iniciar sesión",
        registerError: "Error al registrarse",
      },

      // Dashboard
      dashboard: {
        title: "Dashboard",
        subtitle:
          "Visión integral y en tiempo real del progreso y el impacto de los proyectos",
        metrics: {
          fundsAssigned: "Fondos Asignados",
          skillCertificates: "Certificados de Habilidad",
          beneficiariesReached: "Beneficiarios Alcanzados",
          sroiRatio: "Ratio SROI",
          sroiDescription: "de valor por cada $ invertido",
        },
        charts: {
          projectCompletion: "Porcentaje de Cumplimiento de Proyectos",
          projectStatus: "Estado General de Proyectos",
          sdgAlignment: "Alineación con los Objetivos de Desarrollo Sostenible",
          populationImpact: "Impacto en la población",
          demographics: "Demografía",
        },
        status: {
          completed: "Completados",
          inProgress: "En Progreso",
          pending: "Pendientes",
        },
      },

      // Projects
      projects: {
        title: "Proyectos",
        available: "Disponibles para Financiar",
        funded: "Ya Financiados",
        all: "Todos",
        category: "Categoría",
        status: "Estado",
        funding: "Financiamiento",
        beneficiaries: "Beneficiarios",
        sroi: "SROI",
        duration: "Duración",
        location: "Ubicación",
        viewDetails: "Ver Detalles",
        fundProject: "Financiar Proyecto",
        categories: {
          agua: "Agua",
          salud: "Salud",
          educacion: "Educación",
          agricultura: "Agricultura",
          energia: "Energía",
          tecnologia: "Tecnología",
        },
        statuses: {
          available: "Disponible",
          funded: "Financiado",
          "in-progress": "En Progreso",
          completed: "Completado",
          verified: "Verificado",
        },
      },

      // Training
      training: {
        title: "Capacitaciones",
        register: "Registrar Capacitación",
        verify: "Verificar Capacitación",
        technical: "Técnico",
        producer: "Productor",
        evidence: "Evidencia",
        ipfsHash: "Hash IPFS",
        status: "Estado",
        category: "Categoría",
        participants: "Participantes",
        duration: "Duración (horas)",
        date: "Fecha",
        verification: "Verificación",
        categories: {
          agricultura: "Agricultura",
          tecnologia: "Tecnología",
          salud: "Salud",
          educacion: "Educación",
          negocios: "Negocios",
          sostenibilidad: "Sostenibilidad",
        },
        statuses: {
          pending: "Pendiente",
          verified: "Verificada",
          rejected: "Rechazada",
        },
      },
    },
  },
  en: {
    translation: {
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        back: "Back",
        next: "Next",
        previous: "Previous",
        search: "Search",
        filter: "Filter",
        clear: "Clear",
        expand: "Expand",
        collapse: "Collapse",
      },

      // Navigation
      nav: {
        dashboard: "Dashboard",
        projects: "Projects",
        trainings: "Trainings",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
      },

      // Auth
      auth: {
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        name: "Name",
        organization: "Organization",
        role: "Role",
        forgotPassword: "Forgot your password?",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loginSuccess: "Login successful",
        registerSuccess: "Registration successful",
        loginError: "Login error",
        registerError: "Registration error",
      },

      // Dashboard
      dashboard: {
        title: "Dashboard",
        subtitle:
          "Comprehensive and real-time view of project progress and impact",
        metrics: {
          fundsAssigned: "Funds Assigned",
          skillCertificates: "Skill Certificates",
          beneficiariesReached: "Beneficiaries Reached",
          sroiRatio: "SROI Ratio",
          sroiDescription: "of value for every $ invested",
        },
        charts: {
          projectCompletion: "Project Completion Percentage",
          projectStatus: "General Project Status",
          sdgAlignment: "Alignment with Sustainable Development Goals",
          populationImpact: "Impact on the population",
          demographics: "Demographics",
        },
        status: {
          completed: "Completed",
          inProgress: "In Progress",
          pending: "Pending",
        },
      },

      // Projects
      projects: {
        title: "Projects",
        available: "Available to Fund",
        funded: "Already Funded",
        all: "All",
        category: "Category",
        status: "Status",
        funding: "Funding",
        beneficiaries: "Beneficiaries",
        sroi: "SROI",
        duration: "Duration",
        location: "Location",
        viewDetails: "View Details",
        fundProject: "Fund Project",
        categories: {
          agua: "Water",
          salud: "Health",
          educacion: "Education",
          agricultura: "Agriculture",
          energia: "Energy",
          tecnologia: "Technology",
        },
        statuses: {
          available: "Available",
          funded: "Funded",
          "in-progress": "In Progress",
          completed: "Completed",
          verified: "Verified",
        },
      },

      // Training
      training: {
        title: "Trainings",
        register: "Register Training",
        verify: "Verify Training",
        technical: "Technical",
        producer: "Producer",
        evidence: "Evidence",
        ipfsHash: "IPFS Hash",
        status: "Status",
        category: "Category",
        participants: "Participants",
        duration: "Duration (hours)",
        date: "Date",
        verification: "Verification",
        categories: {
          agricultura: "Agriculture",
          tecnologia: "Technology",
          salud: "Health",
          educacion: "Education",
          negocios: "Business",
          sostenibilidad: "Sustainability",
        },
        statuses: {
          pending: "Pending",
          verified: "Verified",
          rejected: "Rejected",
        },
      },
    },
  },
  pt: {
    translation: {
      // Common
      common: {
        loading: "Carregando...",
        error: "Erro",
        success: "Sucesso",
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Salvar",
        edit: "Editar",
        delete: "Excluir",
        view: "Ver",
        back: "Voltar",
        next: "Próximo",
        previous: "Anterior",
        search: "Buscar",
        filter: "Filtrar",
        clear: "Limpar",
        expand: "Expandir",
        collapse: "Recolher",
      },

      // Navigation
      nav: {
        dashboard: "Dashboard",
        projects: "Projetos",
        trainings: "Treinamentos",
        profile: "Perfil",
        settings: "Configurações",
        logout: "Sair",
      },

      // Auth
      auth: {
        login: "Entrar",
        register: "Registrar",
        email: "E-mail",
        password: "Senha",
        name: "Nome",
        organization: "Organização",
        role: "Função",
        forgotPassword: "Esqueceu sua senha?",
        noAccount: "Não tem uma conta?",
        haveAccount: "Já tem uma conta?",
        loginSuccess: "Login realizado com sucesso",
        registerSuccess: "Registro realizado com sucesso",
        loginError: "Erro no login",
        registerError: "Erro no registro",
      },

      // Dashboard
      dashboard: {
        title: "Dashboard",
        subtitle:
          "Visão abrangente e em tempo real do progresso e impacto dos projetos",
        metrics: {
          fundsAssigned: "Fundos Atribuídos",
          skillCertificates: "Certificados de Habilidade",
          beneficiariesReached: "Beneficiários Alcançados",
          sroiRatio: "Taxa SROI",
          sroiDescription: "de valor para cada $ investido",
        },
        charts: {
          projectCompletion: "Percentual de Conclusão dos Projetos",
          projectStatus: "Status Geral dos Projetos",
          sdgAlignment:
            "Alinhamento com os Objetivos de Desenvolvimento Sustentável",
          populationImpact: "Impacto na população",
          demographics: "Demografia",
        },
        status: {
          completed: "Concluídos",
          inProgress: "Em Progresso",
          pending: "Pendentes",
        },
      },

      // Projects
      projects: {
        title: "Projetos",
        available: "Disponíveis para Financiar",
        funded: "Já Financiados",
        all: "Todos",
        category: "Categoria",
        status: "Status",
        funding: "Financiamento",
        beneficiaries: "Beneficiários",
        sroi: "SROI",
        duration: "Duração",
        location: "Localização",
        viewDetails: "Ver Detalhes",
        fundProject: "Financiar Projeto",
        categories: {
          agua: "Água",
          salud: "Saúde",
          educacion: "Educação",
          agricultura: "Agricultura",
          energia: "Energia",
          tecnologia: "Tecnologia",
        },
        statuses: {
          available: "Disponível",
          funded: "Financiado",
          "in-progress": "Em Progresso",
          completed: "Concluído",
          verified: "Verificado",
        },
      },

      // Training
      training: {
        title: "Treinamentos",
        register: "Registrar Treinamento",
        verify: "Verificar Treinamento",
        technical: "Técnico",
        producer: "Produtor",
        evidence: "Evidência",
        ipfsHash: "Hash IPFS",
        status: "Status",
        category: "Categoria",
        participants: "Participantes",
        duration: "Duração (horas)",
        date: "Data",
        verification: "Verificação",
        categories: {
          agricultura: "Agricultura",
          tecnologia: "Tecnologia",
          salud: "Saúde",
          educacion: "Educação",
          negocios: "Negócios",
          sostenibilidad: "Sustentabilidade",
        },
        statuses: {
          pending: "Pendente",
          verified: "Verificado",
          rejected: "Rejeitado",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // default language
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
