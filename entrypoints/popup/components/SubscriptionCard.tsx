import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface SubscriptionCardProps {
  isActive: boolean;
  plan?: string;
  onSubscribe: (plan: "monthly" | "yearly") => void;
  onManage?: () => void;
  isLoading?: boolean;
}

export function SubscriptionCard({
  isActive,
  plan,
  onSubscribe,
  onManage,
  isLoading,
}: SubscriptionCardProps) {
  if (isActive) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Subscription</CardTitle>
            <Badge variant="success" size="sm">
              Active
            </Badge>
          </div>
          <CardDescription>
            {plan === "yearly" ? "Yearly Plan" : "Monthly Plan"}
          </CardDescription>
        </CardHeader>
        <CardPanel>
          <p className="text-sm text-muted-foreground">
            You have full access to TTS and translation features.
          </p>
        </CardPanel>
        {onManage && (
          <CardFooter>
            <Button variant="outline" size="sm" onClick={onManage}>
              Manage Subscription
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Choose a Plan</CardTitle>
        <CardDescription>
          Subscribe to unlock TTS and translation
        </CardDescription>
      </CardHeader>
      <CardPanel className="space-y-2.5">
        {/* Monthly Plan */}
        <div className="flex items-center justify-between p-3 border rounded-xl bg-background">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">Monthly</p>
            <p className="text-xs text-muted-foreground">¥900/month</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSubscribe("monthly")}
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="size-3.5" /> : "Select"}
          </Button>
        </div>

        {/* Yearly Plan - Recommended */}
        <div className="relative flex items-center justify-between p-3 border-2 border-primary/20 rounded-xl bg-primary/5">
          <Badge variant="default" size="sm" className="absolute -top-2 left-3">
            Best Value
          </Badge>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">Yearly</p>
              <Badge variant="success" size="sm">
                Save 26%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">¥8,000/year</p>
          </div>
          <Button
            size="sm"
            onClick={() => onSubscribe("yearly")}
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="size-3.5" /> : "Select"}
          </Button>
        </div>
      </CardPanel>
    </Card>
  );
}
