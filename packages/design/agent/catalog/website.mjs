/**
 * Website patterns compose primitives into an application-shaped surface.
 *
 * Callers bring routes, content and service state; these entries describe how
 * the system's components fit together. They ship from their own entry point,
 * and the documentation site lists them as the Website group of its component
 * catalogue, at `/components/<slug>/`.
 */
export const WEBSITE = [
  {
    "name": "SiteShell",
    "group": "Website",
    "summary": "Page landmarks, footer groups and shared section headings.",
    "when": "Compose the document shell while the host supplies routing links and content.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "SiteNavigation",
    "group": "Website",
    "summary": "Responsive navigation and explicit language or appearance choices.",
    "when": "Use one named navigation region with a keyboard-accessible mobile drawer.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Portfolio",
    "group": "Website",
    "summary": "An editorial introduction, featured images, records and a question card.",
    "when": "Build a personal or studio index from supplied text, images and actions.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "PortfolioIndex",
    "group": "Website",
    "summary": "Tabbed collections with a supporting editorial column.",
    "when": "Group related collections under a named tab strip with keyboard selection.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Collection",
    "group": "Website",
    "summary": "Collection headings, search controls, featured records and empty states.",
    "when": "Display a searchable archive without moving filtering or data access into the package.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Reading",
    "group": "Website",
    "summary": "Article and project layouts, outlines, media and installation instructions.",
    "when": "Build long-form reading surfaces with consistent section spacing and accessible navigation.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Contact",
    "group": "Website",
    "summary": "A correspondence form, contact facts, questions and location imagery.",
    "when": "Provide localized field labels and host-owned submission state to a complete form.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Music",
    "group": "Website",
    "summary": "Featured recordings, track rows and playlist collections.",
    "when": "Present supplied listening data and playback controls without choosing a music service.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Timeline",
    "group": "Website",
    "summary": "Career records, profile narratives and chronological lists.",
    "when": "Present dated work, education and personal background using supplied content.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Recovery",
    "group": "Website",
    "summary": "Loading, unavailable and missing-page states with recovery actions.",
    "when": "Explain the current state and provide a real next action.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Media",
    "group": "Website",
    "summary": "Photograph collections, lightboxes, image details and map controls.",
    "when": "Compose image browsing and map presentation while the host owns images and map lifecycles.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Metrics",
    "group": "Website",
    "summary": "Metric panels, accessible data tables and chart arrangements.",
    "when": "Arrange measurements and externally rendered charts without importing chart engines.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "SearchPalette",
    "group": "Website",
    "summary": "Search results, actions and a detail view in one accessible modal.",
    "when": "Pass already-filtered results; the package owns the combobox and focus behavior.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Content",
    "group": "Website",
    "summary": "Formatted code, clipboard actions, step sequences and rich-content elements.",
    "when": "Render supplied text and highlighted code with consistent reading and copy affordances.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Actions",
    "group": "Website",
    "summary": "Share action menus and a scroll-to-top control.",
    "when": "Connect generic accessible controls to host-owned share and scroll intentions.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Conversation",
    "group": "Website",
    "summary": "Conversation threads, answers, citations, composers and floating chat surfaces.",
    "when": "Compose a localized assistant interface while the host owns streaming, history and service calls.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  },
  {
    "name": "Evidence",
    "group": "Website",
    "summary": "Expandable traces, source stages, scores and timing summaries.",
    "when": "Explain supplied evidence and progress without exposing private prompts or service details.",
    "practices": [
      {
        "kind": "do",
        "text": "Supply localized labels, descriptive links and meaningful image alternatives."
      },
      {
        "kind": "dont",
        "text": "Do not put service credentials, routing logic or backend models inside presentation components."
      }
    ]
  }
].map((entry) => ({ ...entry, kind: 'pattern' }))
