import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { Eye, EyeOff } from "lucide-react"; // 👈 Ícones adicionados aqui

interface Field {
    nome: string;
    senha: string;
    observacao: string;
}

export default function FormFields() {
    const [fields, setFields] = useState<Field[]>([
        { nome: "", senha: "", observacao: "" },
    ]);
    const [registros, setRegistros] = useState<Field[]>([]);
    const [user, setUser] = useState<any>(null);
    const [mostrarSenhas, setMostrarSenhas] = useState<boolean[]>([]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (usuarioLogado) => {
            if (usuarioLogado) {
                setUser(usuarioLogado);
                buscarCampos(usuarioLogado.uid);
            } else {
                console.warn("Usuário não autenticado.");
            }
        });

        return () => unsubscribe();
    }, []);

    const addField = () => {
        setFields([...fields, { nome: "", senha: "", observacao: "" }]);
    };

    const handleChange = (
        index: number,
        field: keyof Field,
        value: string
    ) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = value;
        setFields(updatedFields);
    };

    const salvarCampos = async () => {
        if (!user) {
            alert("Usuário não autenticado.");
            return;
        }

        try {
            for (const field of fields) {
                if (field.nome || field.senha || field.observacao) {
                    await addDoc(collection(db, "senhas"), {
                        nome: field.nome,
                        senha: AES.encrypt(field.senha, "chave-secreta").toString(),
                        observacao: field.observacao,
                        uid: user.uid,
                        criadoEm: new Date(),
                    });
                }
            }

            alert("Campos salvos com sucesso!");
            setFields([{ nome: "", senha: "", observacao: "" }]);
            buscarCampos(user.uid);
        } catch (error) {
            console.error("Erro ao salvar campos:", error);
            alert("Erro ao salvar campos.");
        }
    };

    const buscarCampos = async (uid: string) => {
        try {
            const q = query(
                collection(db, "senhas"),
                where("uid", "==", uid)
            );

            const querySnapshot = await getDocs(q);
            const lista: Field[] = [];

            querySnapshot.forEach((doc) => {
                lista.push(doc.data() as Field);
            });

            setRegistros(lista);
            setMostrarSenhas(new Array(lista.length).fill(false));
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    return (
        <div className="flex items-center justify-center text-sm">
            <div className="flex flex-col gap-4 w-[30%]">
                {fields.map((field, index) => (
                    <div
                        className="flex flex-col w-full border-2 p-3 mb-4 rounded-md border-black-500"
                        key={index}
                    >
                        <label htmlFor={`nome-${index}`} className="text-sm font-sm">NOME</label>
                        <input
                            type="text"
                            id={`nome-${index}`}
                            value={field.nome}
                            onChange={(e) => handleChange(index, "nome", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Nome do site/App"
                        />

                        <label htmlFor={`senha-${index}`} className="text-sm font-sm">SENHA</label>
                        <input
                            type="password"
                            id={`senha-${index}`}
                            value={field.senha}
                            onChange={(e) => handleChange(index, "senha", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Senha"
                        />

                        <label htmlFor={`observacao-${index}`} className="text-sm font-sm">OBSERVAÇÃO</label>
                        <input
                            type="text"
                            id={`observacao-${index}`}
                            value={field.observacao}
                            onChange={(e) => handleChange(index, "observacao", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Observação"
                        />
                    </div>
                ))}

                <button
                    onClick={salvarCampos}
                    className="mt-1 py-2 bg-green-600 w-[150px] text-white rounded-md"
                >
                    Salvar Tudo
                </button>

                {registros.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">Registros Salvos:</h2>
                        {registros.map((reg, idx) => (
                            <div
                                key={idx}
                                className="border p-3 mb-3 rounded-md bg-gray-100"
                            >
                                <p><strong>Nome:</strong> {reg.nome}</p>
                                <div className="flex items-center gap-2">
                                    <p><strong>Senha:</strong></p>
                                    <p className="break-all">
                                        {mostrarSenhas[idx]
                                            ? AES.decrypt(reg.senha, "chave-secreta").toString(Utf8)
                                            : "•••••"}
                                    </p>
                                    <button
                                        onClick={() => {
                                            const updated = [...mostrarSenhas];
                                            updated[idx] = !updated[idx];
                                            setMostrarSenhas(updated);
                                        }}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        {mostrarSenhas[idx] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p><strong>Observação:</strong> {reg.observacao}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}