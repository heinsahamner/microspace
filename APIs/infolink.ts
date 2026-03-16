
import { Service } from '../services/supabase';

/**
 * ============================================================================
 * API: INFOLINK (Microspace Context Provider)
 * ============================================================================
 * 
 * DESCRIÇÃO:
 * Esta API agrega informações estruturais do estado atual do Microspace.
 * Ela serve para fornecer contexto (Turmas, Matérias, Tipos de Post) para
 * outros aplicativos ou scripts que desejam se integrar ao ecossistema.
 * 
 * ----------------------------------------------------------------------------
 * GUIA DE IMPLEMENTAÇÃO / COMO USAR
 * ----------------------------------------------------------------------------
 * 
 * MÉTODO 1: Uso Interno (No mesmo projeto React)
 * ----------------------------------------------
 * Basta importar e chamar a função assíncrona:
 * 
 *    import { getMicrospaceContext } from '../../APIs/infolink';
 *    
 *    const context = await getMicrospaceContext();
 *    console.log(context.groups, context.subjects);
 * 
 * 
 * MÉTODO 2: Comunicação entre Apps (Window Messaging / Iframe)
 * ------------------------------------------------------------
 * Se você tiver outro app Microspace rodando em um iframe ou aba diferente,
 * você pode expor esses dados via listener de eventos no `App.tsx`:
 * 
 *    // No Microspace Principal (Provider):
 *    window.addEventListener('message', async (event) => {
 *        if (event.data === 'MICROSPACE_REQUEST_INFO') {
 *            const data = await getMicrospaceContext();
 *            event.source.postMessage({ type: 'MICROSPACE_INFO', payload: data }, event.origin);
 *        }
 *    });
 * 
 *    // No Outro App (Consumer):
 *    window.parent.postMessage('MICROSPACE_REQUEST_INFO', '*');
 *    window.addEventListener('message', (event) => {
 *        if (event.data.type === 'MICROSPACE_INFO') {
 *            console.log("Contexto Recebido:", event.data.payload);
 *        }
 *    });
 * 
 * ============================================================================
 */

export interface MicrospaceContextResponse {
    appName: string;
    version: string;
    timestamp: string;
    structure: {
        categories: Array<{ id: string; label: string; description: string }>;
        groups: Array<{ id: string; name: string; year: number; slug: string }>;
        subjects: Array<{ id: string; name: string; groupId: string; color: string }>;
    };
    stats: {
        totalGroups: number;
        totalSubjects: number;
    };
}

export const getMicrospaceContext = async (): Promise<MicrospaceContextResponse> => {
    try {
        // Busca paralela para otimizar performance
        const [groups, subjects] = await Promise.all([
            Service.getGroups(),
            Service.getAllSubjects()
        ]);

        // Definição estática das categorias suportadas pelo sistema
        const categories = [
            { id: 'summary', label: 'Resumo', description: 'Materiais de estudo e sínteses.' },
            { id: 'activity', label: 'Atividade', description: 'Exercícios e tarefas de casa.' },
            { id: 'assessment', label: 'Prova', description: 'Avaliações e testes anteriores.' },
            { id: 'flashcards', label: 'Flashcards', description: 'Baralhos de repetição espaçada.' }
        ];

        return {
            appName: 'Microspace Materials',
            version: '4.5.0',
            timestamp: new Date().toISOString(),
            structure: {
                categories,
                groups: groups.map(g => ({
                    id: g.id,
                    name: g.name,
                    year: g.academic_year,
                    slug: g.slug
                })),
                subjects: subjects.map(s => ({
                    id: s.id,
                    name: s.name,
                    groupId: s.group_id,
                    color: s.color_hex
                }))
            },
            stats: {
                totalGroups: groups.length,
                totalSubjects: subjects.length
            }
        };

    } catch (error) {
        console.error("InfoLink Error: Falha ao agregar contexto.", error);
        throw new Error("Não foi possível gerar o contexto do Microspace.");
    }
};
