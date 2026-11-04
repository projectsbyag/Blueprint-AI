# Blueprint - AI-Powered Design Tool

![Blueprint Editor Screenshot](https://placehold.co/1200x600.png?text=Blueprint+App+Screenshot)
*<p align="center">A clean, intuitive interface to bring your design ideas to life.</p>*

Blueprint is a modern, AI-powered design application that allows users to create stunning graphics with ease. Leveraging the power of generative AI, users can generate design layouts from simple text prompts, start from pre-built templates, or build from scratch using a library of elements.

## ✨ Core Features

-   **🤖 AI Design Generation**: Describe your vision in plain text (e.g., "a marketing poster for a new coffee shop") and let our AI, powered by **Genkit**, generate multiple design layouts for you to choose from.
-   **🎨 Dynamic Canvas**: An interactive canvas to add, arrange, and modify design elements.
-   **📚 Template Library**: Kickstart your design process with a selection of pre-designed templates for various use cases.
-   **🧩 Element Library**: Add and customize core design elements like text, shapes, and images.
-   **⚙️ Properties Editor**: Fine-tune every aspect of your selected element, from position and size to colors, fonts, and styles.
-   **👤 User Authentication**: Secure user accounts and sessions provided by **Firebase Authentication**.
-   **📥 Download Your Work**: Export your design layout as a JSON file.

## 🚀 Tech Stack

Blueprint is built with a modern, full-stack TypeScript architecture:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Library**: [React](https://reactjs.org/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (with Google Gemini)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Hosting**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/blueprint.git
    cd blueprint
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    This project requires API keys from Firebase and Google AI to function correctly.

    -   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
    -   Enable **Email/Password Authentication** in the Firebase console.
    -   Register a new Web App in your Firebase project settings to get your `firebaseConfig` keys.
    -   Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    -   Rename the `.env.example` file to `.env` and add your project-specific keys:
        ```sh
        mv .env.example .env
        ```
    -   Open the `.env` file and fill in the required values.

4.  **Run the Development Server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
