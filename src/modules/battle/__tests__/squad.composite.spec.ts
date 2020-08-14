import { Squad } from '../composites/squad.composite';
import { CreateUnitDto } from '../DTOs/create-unit.dto';
import { Vehicle } from '../composites/vehicle.composite';
import { Operator } from '../composites/leafs/operator.leaf';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { StrategyEnum } from '../../../enums/strategy.enum';
import { GetHealthPointsVisitor } from '../visitors/get-health-points.visitior';
import { CalculateBaseAttackSuccessVisitor } from '../visitors/calculate-base-attack-success.visitor';
import { CalculateBaseAttackDamageVisitor } from '../visitors/calculate-base-attack-damage.visitior';
import { InflictBaseDamageVisitor } from '../visitors/inflict-base-damage.visitor';
import { geometricMean, randomRange } from '../../../utils';
import { UnitLevelUpVisitor } from '../visitors/unit-level-up.visitor';
import { CalculateRechargeTimeVisitor } from '../visitors/calculate-recharge-time.visitor';
import { FilterInActiveUnitsVisitor } from '../visitors/filter-inactive-units.visitor';

describe('SquadComposite', () => {
  const createUnitDto: CreateUnitDto = { id: 1, healthPoints: 100, recharge: 2000 };

  let mockSquad: Squad;
  let mockVehicle: Vehicle;
  let mockSoldier: Soldier;
  let mockOperator: Operator;

  const defaultRechargeTime = 2000;
  const subtractRechargeOnLevelUp = 25;

  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
  });

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
      const soldierRate = calculateSoldierSuccessRate();
      const vehicleRate = calculateVehicleSuccessRate();

      const visitor = new CalculateBaseAttackSuccessVisitor();

      const expectedResult = soldierRate + vehicleRate;
      const result = visitor.calculateAttackSuccess(mockSquad);

      expect(result).toBe(expectedResult);
    });
  });

  describe('CalculateBaseAttackDamageVisitor', function() {
    it('should return total damage based on sum of all squad units', async function() {
      const soldierDamage = calculateSoldierDamageRate();
      const vehicleDamage = calculateVehicleDamageRate();

      const expectedResult = soldierDamage + vehicleDamage;

      const visitor = new CalculateBaseAttackDamageVisitor();
      const result = visitor.calculateAttackDamage(mockSquad);

      expect(result).toBe(expectedResult);
    });
  });

  describe('InflictBaseDamageVisitor', function() {
    it('should inflict damage to all units', async function() {
      const damage = 10;

      const visitor = new InflictBaseDamageVisitor(10);

      const totalHP = new GetHealthPointsVisitor().getTotalHealthPoints(mockSquad);
      const expectedResult = totalHP - damage - damage * 0.6 - damage * 0.2;

      visitor.inflictDamage(mockSquad);

      const result = new GetHealthPointsVisitor().getTotalHealthPoints(mockSquad);

      expect(result).toBe(expectedResult);
    });
  });

  describe('unitLevelUpVisitor', function() {
    const rechargeThreshold = 250;

    const levelUpVisitor = new UnitLevelUpVisitor();

    it('should update soldier experience and recharge', async function() {
      const soldierExperienceBefore = mockSoldier.experience;
      const soldierRechargeBefore = mockSoldier.recharge;

      levelUpVisitor.levelUp(mockSquad);

      expect(mockSoldier.experience).toBe(soldierExperienceBefore + 1);
      expect(mockSoldier.recharge).toBe(soldierRechargeBefore - 25);
    });

    test('soldier recharge must be greater or equal than recharge threshold', async function() {
      for (let i = 0; i <= 71; i++) {
        levelUpVisitor.levelUp(mockSquad);
      }

      expect(mockSoldier.recharge).toBe(rechargeThreshold);
    });

    it('should update operator experience and recharge', async function() {
      const operatorExperienceBefore = mockOperator.experience;
      const operatorRechargeBefore = mockOperator.recharge;

      levelUpVisitor.levelUp(mockSquad);

      expect(mockOperator.experience).toBe(operatorExperienceBefore + 1);
      expect(mockOperator.recharge).toBe(operatorRechargeBefore - 25);
    });

    test('operator recharge must be greater or equal than recharge threshold', async function() {
      for (let i = 0; i <= 71; i++) {
        levelUpVisitor.levelUp(mockSquad);
      }

      expect(mockOperator.recharge).toBe(rechargeThreshold);
    });

    it('should update vehicle recharge', async function() {
      const vehicleRechargeBefore = mockVehicle.recharge;

      levelUpVisitor.levelUp(mockSquad);

      expect(mockVehicle.recharge).toBe(vehicleRechargeBefore - 25);
    });

    test('operator recharge must be greater or equal than recharge threshold', async function() {
      for (let i = 0; i <= 71; i++) {
        levelUpVisitor.levelUp(mockSquad);
      }

      expect(mockOperator.recharge).toBe(rechargeThreshold);
    });
  });

  describe('CalculateRechargeTimeVisitor', function() {
    it('should return maximum recharge time through all units', async function() {
      const levelUpVisitor = new UnitLevelUpVisitor();

      const visitor = new CalculateRechargeTimeVisitor();
      const initialRechargeTime = visitor.calculateRechargeTime(mockSquad);

      expect(initialRechargeTime).toBe(defaultRechargeTime);

      levelUpVisitor.levelUp(mockSquad);
      levelUpVisitor.levelUp(mockSquad);
      levelUpVisitor.levelUp(mockSquad);

      expect(visitor.calculateRechargeTime(mockSquad)).toBe(
        initialRechargeTime - subtractRechargeOnLevelUp * 3, // 1925
      );

      mockSoldier.recharge = 1950;

      expect(visitor.calculateRechargeTime(mockSquad)).toBe(1950);
    });
  });

  describe('FilterInActiveUnitsVisitor', function() {
    it('should filter soldiers when its HP less than or equal 0', async function() {
      mockSoldier.healthPoints = 0;

      const visitor = new FilterInActiveUnitsVisitor();
      visitor.filterInActiveUnits(mockSquad);

      expect(mockSquad.units.some(unit => unit.getType() === mockSoldier.getType())).toBeFalsy();
      expect(mockSquad.units.some(unit => unit.getType() === mockVehicle.getType())).toBeTruthy();
    });

    it('should remove vehicle if its HP is 0', async function() {
      mockVehicle.healthPoints = 0;

      const visitor = new FilterInActiveUnitsVisitor();
      visitor.filterInActiveUnits(mockSquad);

      expect(mockSquad.units.some(unit => unit.getType() === mockVehicle.getType())).toBeFalsy();
      expect(
        mockVehicle.operators.some(unit => unit.getType() === mockOperator.getType()),
      ).toBeFalsy();
      expect(mockSquad.units.some(unit => unit.getType() === mockSoldier.getType())).toBeTruthy();
    });

    it('should filter vehicle if all operators are inActive', async function() {
      mockOperator.healthPoints = 0;

      const visitor = new FilterInActiveUnitsVisitor();
      visitor.filterInActiveUnits(mockSquad);

      expect(mockSquad.units.some(unit => unit.getType() === mockVehicle.getType())).toBeFalsy();
      expect(mockSquad.units.some(unit => unit.getType() === mockSoldier.getType())).toBeTruthy();
    });

    it('should filter only inActive units', async function() {
      mockVehicle.healthPoints = 50;
      mockSoldier.healthPoints = 50;
      mockOperator.healthPoints = 50;

      const visitor = new FilterInActiveUnitsVisitor();
      visitor.filterInActiveUnits(mockSquad);

      expect(mockSquad.units.some(unit => unit.getType() === mockVehicle.getType())).toBeTruthy();
      expect(mockSquad.units.some(unit => unit.getType() === mockSoldier.getType())).toBeTruthy();
      expect(
        mockVehicle.operators.some(unit => unit.getType() === mockOperator.getType()),
      ).toBeTruthy();
    });
  });

  const calculateSoldierDamageRate = () => {
    const { experience } = mockSoldier;
    return 0.05 + experience / 100;
  };

  const calculateOperatorDamageRate = () => {
    const { experience } = mockOperator;
    return experience / 100;
  };

  const calculateVehicleDamageRate = () => {
    return 0.1 + calculateOperatorDamageRate();
  };

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
