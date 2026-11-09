import { X, Sun, Moon, Coffee, Type, AlignJustify, Languages } from 'lucide-react';
import { ReaderSettings, ReadingTheme, FontSize, FontFamily, LineHeight } from '../types/settings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSetting: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  const isSepia = settings.theme === 'sepia';
  const isDark = settings.theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div
        className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border transition-colors ${
          isDark
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : isSepia
            ? 'bg-[#f7eedc] border-[#e5d3aa] text-[#3e3223]'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/50 dark:border-stone-800">
          <h3 className="font-serif font-bold text-base flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Tùy Chỉnh Chế Độ Đọc
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Đóng bảng tùy chỉnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5 text-sm">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider opacity-70 block mb-2">
              Màu Nền & Không Gian Đọc
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSetting('theme', 'light')}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 font-medium transition-all ${
                  settings.theme === 'light'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs">Sáng</span>
              </button>

              <button
                onClick={() => onUpdateSetting('theme', 'sepia')}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 font-medium transition-all ${
                  settings.theme === 'sepia'
                    ? 'border-[#8c6b38] bg-[#ecddbf] text-[#3e3223] ring-2 ring-[#8c6b38]/20'
                    : 'border-[#dfcca0] bg-[#fbf0d9] text-[#55432d] hover:bg-[#f2e5c8]'
                }`}
              >
                <Coffee className="w-4 h-4 text-[#8c6b38]" />
                <span className="text-xs">Giấy Ngà</span>
              </button>

              <button
                onClick={() => onUpdateSetting('theme', 'dark')}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 font-medium transition-all ${
                  settings.theme === 'dark'
                    ? 'border-amber-500 bg-stone-800 text-stone-100 ring-2 ring-amber-500/20'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="text-xs">Ban Đêm</span>
              </button>
            </div>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider opacity-70 block mb-2">
              Kiểu Chữ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSetting('fontFamily', 'serif')}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  settings.fontFamily === 'serif'
                    ? 'border-amber-600 bg-amber-600/10 font-serif font-bold text-amber-700 dark:text-amber-300'
                    : 'border-stone-200/80 dark:border-stone-800 font-serif'
                }`}
              >
                <span className="text-base block">Lora</span>
                <span className="text-[11px] opacity-60">Chữ sách có chân</span>
              </button>

              <button
                onClick={() => onUpdateSetting('fontFamily', 'sans')}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  settings.fontFamily === 'sans'
                    ? 'border-amber-600 bg-amber-600/10 font-sans font-bold text-amber-700 dark:text-amber-300'
                    : 'border-stone-200/80 dark:border-stone-800 font-sans'
                }`}
              >
                <span className="text-base block">Plus Jakarta</span>
                <span className="text-[11px] opacity-60">Không chân hiện đại</span>
              </button>
            </div>
          </div>

          {/* Font Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider opacity-70">
                Cỡ Chữ
              </label>
              <span className="text-xs font-mono opacity-80 uppercase">{settings.fontSize}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(['sm', 'base', 'lg', 'xl', '2xl'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSetting('fontSize', size)}
                  className={`py-2 rounded-lg border text-xs font-mono transition-all ${
                    settings.fontSize === size
                      ? 'border-amber-600 bg-amber-600 text-white font-bold'
                      : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-600/40'
                  }`}
                >
                  {size === 'sm' ? '15px' : size === 'base' ? '17px' : size === 'lg' ? '19px' : size === 'xl' ? '21px' : '23px'}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider opacity-70 block mb-2">
              Khoảng Cách Dòng
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Vừa' },
                  { id: 'relaxed', label: 'Rộng rãi' },
                  { id: 'loose', label: 'Thoáng đãng' },
                ] as { id: LineHeight; label: string }[]
              ).map((lh) => (
                <button
                  key={lh.id}
                  onClick={() => onUpdateSetting('lineHeight', lh.id)}
                  className={`py-2 rounded-lg border text-xs transition-all flex items-center justify-center gap-1.5 ${
                    settings.lineHeight === lh.id
                      ? 'border-amber-600 bg-amber-600/10 text-amber-700 dark:text-amber-300 font-semibold'
                      : 'border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5 opacity-60" />
                  <span>{lh.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bilingual Toggle */}
          <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800">
            <button
              onClick={() => onUpdateSetting('showBilingual', !settings.showBilingual)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                settings.showBilingual
                  ? 'border-amber-600 bg-amber-600/10 text-amber-800 dark:text-amber-200'
                  : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-600/30'
              }`}
            >
              <div className="flex items-center gap-2.5 text-left">
                <Languages className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-medium text-xs sm:text-sm block">Đối chiếu tiếng Anh gốc (Bilingual)</span>
                  <span className="text-[11px] opacity-60 block">Hiển thị song song bản dịch tiếng Việt và văn bản gốc</span>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  settings.showBilingual ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.showBilingual ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
