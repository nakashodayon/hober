import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "en", name: "English", native: "English" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const selectedLang = LANGUAGES.find((l) => l.code === value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Translation Language</CardTitle>
        <CardDescription>
          Choose your target language for translations
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger size="default">
            <SelectValue>
              {selectedLang
                ? `${selectedLang.native} (${selectedLang.name})`
                : "Select language"}
            </SelectValue>
          </SelectTrigger>
          <SelectPopup>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.native} ({lang.name})
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </CardPanel>
    </Card>
  );
}
