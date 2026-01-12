# Arquetipos del Vínculo 🧠

Test de evaluación psicológica basado en la teoría de Andrés Morales Ángel sobre las Funciones Materna (Nutrición) y Paterna (Protección) en los vínculos afectivos.

## 🚀 Despliegue en Vercel

### Requisitos Previos

1. **Cuenta de GitHub** - [Crear cuenta](https://github.com/signup)
2. **Cuenta de Vercel** - [Crear cuenta](https://vercel.com/signup) (puedes usar tu cuenta de GitHub)
3. **API Key de Gemini** - [Obtener API Key](https://aistudio.google.com/app/apikey)

### Paso 1: Subir a GitHub

```bash
# Inicializar repositorio Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - Arquetipos del Vínculo"

# Crear repositorio en GitHub y seguir las instrucciones para subir el código
# O usar GitHub CLI:
gh repo create arquetipos-del-vinculo --public --push --source=.
```

### Paso 2: Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **"Import"** junto a tu repositorio
3. Vercel detectará automáticamente la configuración (vercel.json)
4. Haz clic en **"Deploy"**

### Paso 3: Configurar Variable de Entorno (¡IMPORTANTE!)

⚠️ **Sin este paso, la aplicación NO funcionará**

1. En el dashboard de Vercel, ve a tu proyecto
2. Navega a **Settings** → **Environment Variables**
3. Añade la siguiente variable:

| Nombre | Valor |
|--------|-------|
| `GEMINI_API_KEY` | Tu API key de Gemini |

4. Haz clic en **"Save"**
5. Ve a **Deployments** y haz clic en **"Redeploy"** para aplicar los cambios

### Paso 4: ¡Listo!

Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

---

## 💻 Desarrollo Local

### Opción 1: Con Vercel CLI (Recomendada)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Crear archivo .env.local con tu API key
echo "GEMINI_API_KEY=tu_api_key_aqui" > .env.local

# Iniciar servidor de desarrollo
vercel dev
```

Tu app estará en `http://localhost:3000`

### Opción 2: Solo Frontend (Sin IA)

Para probar solo el frontend sin la funcionalidad de IA:

```bash
# Usar cualquier servidor HTTP estático
npx serve .
# o
python -m http.server 8000
```

---

## 📁 Estructura del Proyecto

```
├── api/
│   └── analyze.js      # Serverless function (llama a Gemini)
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js              # Lógica principal de la aplicación
├── ai-service.js       # Servicio de IA (llama a /api/analyze)
├── config.js           # Configuración (scoring, escalas, UI)
├── questions.json      # Preguntas del test
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

---

## 🔒 Seguridad

- ✅ La API key de Gemini está protegida en variables de entorno del servidor
- ✅ El frontend nunca tiene acceso a la API key
- ✅ CORS configurado para permitir solo las solicitudes necesarias
- ✅ Validación de entrada en el servidor

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES Modules)
- **Charts**: Chart.js
- **PDF Export**: jsPDF + html2canvas
- **AI**: Google Gemini API
- **Hosting**: Vercel (Serverless Functions)

---

## 📝 Licencia

© 2026 Arquetipos del Vínculo | Basado en la teoría de Andrés Morales Ángel
