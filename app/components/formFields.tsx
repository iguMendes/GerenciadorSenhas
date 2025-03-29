import { useState } from "react";

interface Field {
    nome: string;
    senha: string;
    observacao: string;
}
export default function FormFields() {

    const [fields, setFields] = useState<Field[]>([
        { nome: "", senha: "", observacao: "" },
    ]);

    // Função para adicionar um novo conjunto de campos
    const addField = () => {
        setFields([...fields, { nome: "", senha: "", observacao: "" }]);
    };

    // Função para atualizar os valores dos campos
    const handleChange = (
        index: number,
        field: keyof Field,
        value: string
    ) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = value;
        setFields(updatedFields);
    };

    return (
        <div className="flex items-center justify-center text-sm">
            {/* Contêiner principal */}
            <div className="flex flex-col gap-4 w-[30%]">
                {/* Mapeando os campos e criando uma nova div para cada conjunto */}
                {fields.map((field, index) => (
                    <div
                        className="flex flex-col w-full border-2 p-3 mb-4 rounded-md border-black-500" // Borda sempre preta
                        key={index}
                    >
                        <label htmlFor={`nome-${index}`} className="text-sm font-sm">
                            NOME
                        </label>
                        <input
                            type="text"
                            id={`nome-${index}`}
                            value={field.nome}
                            onChange={(e) => handleChange(index, "nome", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Nome do site/App"
                        />

                        <label htmlFor={`senha-${index}`} className="text-sm font-sm">
                            SENHA
                        </label>
                        <input
                            type="password"
                            id={`senha-${index}`}
                            value={field.senha}
                            onChange={(e) => handleChange(index, "senha", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Senha"
                        />

                        <label htmlFor={`observacao-${index}`} className="text-sm font-sm">
                            OBSERVAÇÃO
                        </label>
                        <input
                            type="text"
                            id={`observacao-${index}`}
                            value={field.observacao}
                            onChange={(e) =>
                                handleChange(index, "observacao", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Observação"
                        />
                    </div>
                ))}

                {/* Botão para adicionar nova div */}
                <button
                    onClick={addField}
                    className="mt-1 py-2 bg-gray-500 w-[150px] text-white rounded-md"
                >
                    Adicionar Campo
                </button>
            </div>
        </div>
    );
}