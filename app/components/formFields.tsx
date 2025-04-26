import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { Eye, EyeOff, Trash2, Pencil, Save } from "lucide-react";

interface Field {
    nome: string;
    senha: string;
    observacao: string;
    id?: string; // <- agora temos ID
}

export default function FormFields() {
    const [fields, setFields] = useState<Field[]>([
        { nome: "", senha: "", observacao: "" },
    ]);
    const [registros, setRegistros] = useState<Field[]>([]);
    const [user, setUser] = useState<any>(null);
    const [mostrarSenhasCampos, setMostrarSenhasCampos] = useState<boolean[]>([]);
    const [mostrarSenhas, setMostrarSenhas] = useState<boolean[]>([]);
    const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
    const [editandoCampos, setEditandoCampos] = useState<Field>({ nome: "", senha: "", observacao: "" });

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
        setMostrarSenhasCampos([...mostrarSenhasCampos, false]);
    };

    const handleChange = (index: number, field: keyof Field, value: string) => {
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
            setMostrarSenhasCampos([false]);
            buscarCampos(user.uid);
        } catch (error) {
            console.error("Erro ao salvar campos:", error);
            alert("Erro ao salvar campos.");
        }
    };

    const buscarCampos = async (uid: string) => {
        try {
            const q = query(collection(db, "senhas"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const lista: Field[] = [];

            querySnapshot.forEach((docSnap) => {
                lista.push({ ...(docSnap.data() as Field), id: docSnap.id });
            });

            setRegistros(lista);
            setMostrarSenhas(new Array(lista.length).fill(false));
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    const deletarCampo = async (id: string) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este registro?");
        if (!confirmar) {
            return;
        }
        try {
            await deleteDoc(doc(db, "senhas", id));
            alert("Registro deletado!");
            buscarCampos(user.uid);
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar registro.");
        }
    };

    const iniciarEdicao = (index: number) => {
        const registro = registros[index];
        setEditandoCampos({
            nome: registro.nome,
            senha: AES.decrypt(registro.senha, "chave-secreta").toString(Utf8),
            observacao: registro.observacao,
        });
        setEditandoIndex(index);
    };

    const salvarEdicao = async (id: string) => {
        try {
            await updateDoc(doc(db, "senhas", id), {
                nome: editandoCampos.nome,
                senha: AES.encrypt(editandoCampos.senha, "chave-secreta").toString(),
                observacao: editandoCampos.observacao,
            });
            alert("Registro atualizado!");
            setEditandoIndex(null);
            buscarCampos(user.uid);
        } catch (error) {
            console.error("Erro ao editar:", error);
            alert("Erro ao editar registro.");
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
                        <div className="relative w-full">
                            <input
                                type={mostrarSenhasCampos[index] ? "text" : "password"}
                                id={`senha-${index}`}
                                value={field.senha}
                                onChange={(e) => handleChange(index, "senha", e.target.value)}
                                className="w-full px-3 py-2 border rounded-md pr-10"
                                placeholder="Senha"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = [...mostrarSenhasCampos];
                                    updated[index] = !updated[index];
                                    setMostrarSenhasCampos(updated);
                                }}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-black"
                            >
                                {mostrarSenhasCampos[index] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

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
                                key={reg.id}
                                className="border p-3 mb-3 rounded-md bg-gray-100 flex flex-col gap-2"
                            >
                                {editandoIndex === idx ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editandoCampos.nome}
                                            onChange={(e) => setEditandoCampos({ ...editandoCampos, nome: e.target.value })}
                                            className="px-2 py-1 border rounded"
                                        />
                                        <input
                                            type="text"
                                            value={editandoCampos.senha}
                                            onChange={(e) => setEditandoCampos({ ...editandoCampos, senha: e.target.value })}
                                            className="px-2 py-1 border rounded"
                                        />
                                        <input
                                            type="text"
                                            value={editandoCampos.observacao}
                                            onChange={(e) => setEditandoCampos({ ...editandoCampos, observacao: e.target.value })}
                                            className="px-2 py-1 border rounded"
                                        />
                                        <button
                                            onClick={() => salvarEdicao(reg.id!)}
                                            className="bg-blue-500 text-white p-2 rounded flex items-center gap-2 justify-center"
                                        >
                                            <Save size={16} /> Salvar
                                        </button>
                                    </>
                                ) : (
                                    <>
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

                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => iniciarEdicao(idx)}
                                                className="bg-yellow-400 text-black p-2 rounded flex items-center gap-2"
                                            >
                                                <Pencil size={16} /> Editar
                                            </button>
                                            <button
                                                onClick={() => deletarCampo(reg.id!)}
                                                className="bg-red-500 text-white p-2 rounded flex items-center gap-2"
                                            >
                                                <Trash2 size={16} /> Deletar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
