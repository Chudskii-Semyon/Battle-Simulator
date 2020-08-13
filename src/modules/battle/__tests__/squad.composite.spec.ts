import { Squad } from '../composites/squad.composite';
import { CreateUnitDto } from '../DTOs/create-unit.dto';
import { Vehicle } from '../composites/vehicle.composite';
import { Operator } from '../composites/leafs/operator.leaf';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { StrategyEnum } from '../../../enums/strategy.enum';
import { GetHealthPointsVisitor } from '../visitors/get-health-points.visitior';
import { CalculateBaseAttackSuccessVisitor } from '../visitors/calculate-base-attack-success.visitor';
import { geometricMean, randomRange } from '../../../utils';

describe('SquadComposite', () => {
  // let service: BattleService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [BattleService],
  //   }).compile();
  //
  //   service = module.get<BattleService>(BattleService);
  // });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  const createUnitDto: CreateUnitDto = { id: 1, healthPoints: 100, recharge: 2000 };

  let mockSquad: Squad;
  let mockVehicle: Vehicle;
  let mockSoldier: Soldier;
  let mockOperator: Operator;

  const mockMath = Object.create(global.Math);
  mockMath.random = 1;
  global.Math = mockMath;

  // beforeEach(() => {
  //   jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  // });
  //
  // afterEach(() => {
  //   jest.spyOn(global.Math, 'random').mockRestore();
  // });

  beforeEach(() => {
    mockSquad = new Squad(StrategyEnum.RANDOM);
    mockVehicle = new Vehicle(createUnitDto);
    mockSoldier = new Soldier(createUnitDto);
    mockOperator = new Operator(createUnitDto);

    mockVehicle.addOperator(mockOperator);
    mockSquad.addUnit(mockSoldier);
    mockSquad.addUnit(mockVehicle);

    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;
    // jest.spyOn(global.Math, 'random').mockReturnValue(1);
  });

  afterEach(() => {
    // jest.spyOn(global.Math, 'random').mockRestore();
  });

  describe('getHealthPointsVisitor', function() {
    it('should return total HP of all units', function() {
      const visitor = new GetHealthPointsVisitor();

      const expectedResult =
        mockVehicle.healthPoints + mockSoldier.healthPoints + mockOperator.healthPoints;
      const result = visitor.getTotalHealthPoints(mockSquad);

      expect(result).toBe(expectedResult);
    });
  });

  describe('CalculateBaseAttackSuccessVisitor', function() {
    it('should return success probability based on sum of all squad units', function() {
      // const mockRandomRange = jest.spyOn(random).mockImplementation();

      const soldierRate = calculateSoldierSuccessRate();
      const vehicleRate = calculateVehicleSuccessRate();

      const visitor = new CalculateBaseAttackSuccessVisitor();

      const expectedResult = soldierRate + vehicleRate;
      const result = visitor.calculateAttackSuccess(mockSquad);

      expect(result).toBe(expectedResult);
    });
  });

  const calculateSoldierSuccessRate = () => {
    const { healthPoints, experience } = mockSoldier;
    return (0.5 * ((1 + healthPoints / 100) * randomRange(50 + experience, 100))) / 100;
  };

  const calculateOperatorSuccessRate = () => {
    const { healthPoints, experience } = mockOperator;
    return (0.5 * ((1 + healthPoints / 100) * randomRange(50 + experience, 100))) / 100;
  };

  const calculateVehicleSuccessRate = () => {
    const { healthPoints } = mockVehicle;
    const rates: number[] = [calculateOperatorSuccessRate()];

    const operatorsMeanSuccess = geometricMean(rates);

    return 0.5 * (1 + healthPoints / 100) * operatorsMeanSuccess;
  };
});
