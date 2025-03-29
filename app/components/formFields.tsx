import { useState } from "react";

export default function FormFields() {
    const [nome, setNome] = useState<string>("")
    const [senha, setSenha] = useState<string>("")
    const [observacao, setObservacao] = useState<string>("")

    return (
        <div className="flex items-center justify-center text-sm">
          <div className="flex flex-wrap gap-1 w-[40%] border border-black-300 p-3 rounded-md bg-gray-300">
            <div className="flex flex-col w-full">
              <label htmlFor="nome" className="text-sm font-sm ">NOME</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Nome do site/App"
              />
            </div>
      
            <div className="flex flex-col w-full ">
              <label htmlFor="senha" className="text-sm font-sm">SENHA</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Senha"
              />
            </div>
      
            <div className="flex flex-col w-full ">
              <label htmlFor="observacao" className="text-sm font-sm">OBSERVAÇÃO</label>
              <input
                type="text"
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Observação"
              />
            </div>
          </div>
        </div>
      );
}