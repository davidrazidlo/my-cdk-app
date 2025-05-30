import { Stack } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { get } from "http";
import { getSuffixFromStack } from "../infra/utils";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;

  constructor(scope: any, id: string, props?: any) {
    super(scope, id);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new Table(this, "SpacesTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      tableName: `SpacesTable-${suffix}`,
    });
  }
}
