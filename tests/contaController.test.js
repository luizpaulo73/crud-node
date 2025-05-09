// DESCRIBE -> bloco tests 
// IT OR TEST -> declara um teste
// EXPECT -> validar resultados
const contaRepository = require('../repository/contaRepository');
const { getContaPorId } = require('../controller/contasController');

jest.mock('../repository/contaRepository');

describe("Conta Controller tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("Sucesso", async () => {
        const contaMock = [
            {
                "SK": "CONTA#CORRENTE",
                "PK": "CLIENTE#123",
                "saldo": 8000
            },
            {
                "SK": "METADADOS",
                "nomeUsuario": "luiz",
                "PK": "CLIENTE#123",
                "email": "luiz@email"
            }
        ];

        contaRepository.getContaPorIdRepository.mockResolvedValue(contaMock);

        const ctx = {
            params: { id: "123" },
            status: null,
            body: null
        };

        await getContaPorId(ctx);

        expect(contaRepository.getContaPorIdRepository).toHaveBeenCalledWith("123");
        expect(ctx.status).toBe(200);
        expect(ctx.body).toEqual(contaMock);
    });

    it("Conta nao encontrada", async () => {

        contaRepository.getContaPorIdRepository.mockResolvedValue(null);

        const ctx = {
            params: { id: "123" },
            status: null,
            body: null
        };

        await getContaPorId(ctx);

        expect(ctx.status).toBe(404);
        expect(ctx.body).toEqual({ message: 'Conta não encontrada' });
    });

    it("Id nao fornecido", async () => {

        contaRepository.getContaPorIdRepository.mockResolvedValue(null);

        const ctx = {
            params: {},
            status: null,
            body: null
        };

        await getContaPorId(ctx);

        expect(ctx.status).toBe(400);
        expect(ctx.body).toEqual({ message: 'ID inválido.' });
    });
});