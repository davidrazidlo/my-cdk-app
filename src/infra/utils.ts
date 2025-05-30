import { Fn, Stack } from "aws-cdk-lib";

export function getSuffixFromStack(stack: Stack) {
  const shortStackId = Fn.select(2, Fn.split("/", stack.stackId));
  const suffix = Fn.select(1, Fn.split("-", shortStackId));
  return suffix;
}
