import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-2 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

export const Terms: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors">
                        <Icons.ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Termos de Uso</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 pb-24">
                
                <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 mb-8">
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                        Última atualização: 25 de janeiro de 2026
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                        Ao utilizar o Microspace, você concorda com as diretrizes abaixo:
                    </p>
                </div>

                <Section title="1. O Propósito">
                    <p>
                        '-'
                    </p>
                </Section>

                <Section title="2. Conduta e Respeito">
                    <p>
                        '-'
                    </p>

                    <p className="mt-2 font-bold">
                        '-'
                    </p>
                </Section>

                <Section title="3. Direitos Autorais">
                    <p>
                        '-'
                    </p>
                    <p>
                        '-'
                    </p>
                </Section>

                <Section title="4. Privacidade de Dados">
                    <p>
                        '-' 
                    </p>
                    <p>
                        '-'
                    </p>
                </Section>

                <Section title="5. Responsabilidade">
                    <p>
                        '-'
                    </p>
                </Section>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-400 text-sm mb-4">Ainda tem dúvidas?</p>
                    <button 
                        onClick={() => navigate('/settings')}
                        className="text-[#7900c5] font-bold hover:underline"
                    >
                        Entre em contato pelo suporte (não tem suporte ainda)
                    </button>
                </div>

            </div>
        </div>
    );
};
