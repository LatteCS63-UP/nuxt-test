<template>
  <v-container width="1400px" class="border flex flex-col gap-2">
    <v-form>
      <div class="flex gap-x-2 w-[450px] items-center">
        <v-date-input
          prepend-icon=""
          label="Transaction Date"
          density="compact"
          variant="outlined"
          color="primary"
          clearable
          flat
        ></v-date-input>
        <v-btn variant="outlined" color="primary">Search</v-btn>
        <v-btn variant="outlined" color="warning">Export</v-btn>
      </div>
    </v-form>
    <div class="overflow-x-auto">
      <v-data-table-virtual
        :headers="headers"
        :items="dataItems"
        density="compact"
        fixed-header
        class="min-w-max"
      >
        <template v-slot:top>
          <v-expand-transition>
            <div v-if="headers.length < 18">
              <v-btn
                class="mb-2"
                rounded="lg"
                size="small"
                text="Reset"
                variant="text"
                block
                border
                @click="onClickReset"
              ></v-btn>
            </div>
          </v-expand-transition>
        </template>

        <!-- * Header Row -->
        <template v-slot:headers="{ columns }">
          <tr class="border-b-2 border-gray-100">
            <template v-for="(col, idx) in columns" :key="col.key ?? ''">
              <th>
                <span
                  class="text-xs font-semibold"
                  :class="{
                    'text-left': col.align === 'start',
                    'text-center': col.align === 'center',
                    'text-right': col.align === 'end',
                  }"
                  >{{ col.title }}</span
                >
                <v-icon
                  v-if="headers[idx] && headers[idx].removable"
                  color="medium-emphasis"
                  icon="$close"
                  @click="remove(col.key ?? '')"
                ></v-icon>
              </th>
            </template>
          </tr>
        </template>

        <!-- * Body Rows -->
        <template v-slot:item="{ item, columns }">
          <tr
            class="hover:bg-gray-50 cursor-pointer border-b-2 border-gray-100"
          >
            <td
              v-for="col in columns"
              :key="col.key || ''"
              class="text-xs"
              :class="{
                'text-left': col.align === 'start',
                'text-center': col.align === 'center',
                'text-right': col.align === 'end',
              }"
            >
              {{ col.key ? item[col.key] : "" }}
            </td>
          </tr>
        </template>

        <!-- * Sum Row -->
        <template v-slot:body.append>
          <!-- ? THB -->
          <tr class="font-bold">
            <td
              v-for="(col, idx) in headers"
              :key="col.key"
              class="text-xs"
              :class="{
                'text-left': col.align === 'start',
                'text-center': col.align === 'center',
                'text-right': col.align === 'end',
              }"
            >
              <span v-if="col.key === 'name_en'">Total</span>
              <span v-else-if="col.key === 'currency'">THB</span>
              <span v-else-if="col.key === 'avail_dr'">0</span>
              <span v-else-if="col.key === 'avail_cr'">0</span>
              <span v-else-if="col.key === 'pending_buy'">0</span>
              <span v-else-if="col.key === 'pending_sell'">0</span>
              <span v-else-if="col.key === 'ledger_dr'">0</span>
              <span v-else-if="col.key === 'total_settle'">0</span>
              <span v-else-if="col.key === 'short_sell'">0</span>
              <span v-else-if="col.key === 'trust_bl_dr'">0</span>
              <span v-else-if="col.key === 'trust_avail_cr'">0</span>
              <span v-else-if="col.key === 'unckeck_bl'">0</span>
              <span v-else-if="col.key === 'net_trust_dr'">0</span>
              <span v-else-if="col.key === 'net_trust_cr'">0</span>
              <span v-else-if="col.key === 'prop_account'">0</span>
            </td>
          </tr>

          <!-- ? USD -->
          <tr class="font-bold">
            <td
              v-for="(col, idx) in headers"
              :key="col.key"
              class="text-xs"
              :class="{
                'text-left': col.align === 'start',
                'text-center': col.align === 'center',
                'text-right': col.align === 'end',
              }"
            >
              <span v-if="col.key === 'name_en'">Total</span>
              <span v-else-if="col.key === 'currency'">USD</span>
              <span v-else-if="col.key === 'currency'">THB</span>
              <span v-else-if="col.key === 'avail_dr'">0</span>
              <span v-else-if="col.key === 'avail_cr'">0</span>
              <span v-else-if="col.key === 'pending_buy'">0</span>
              <span v-else-if="col.key === 'pending_sell'">0</span>
              <span v-else-if="col.key === 'ledger_dr'">0</span>
              <span v-else-if="col.key === 'total_settle'">0</span>
              <span v-else-if="col.key === 'short_sell'">0</span>
              <span v-else-if="col.key === 'trust_bl_dr'">0</span>
              <span v-else-if="col.key === 'trust_avail_cr'">0</span>
              <span v-else-if="col.key === 'unckeck_bl'">0</span>
              <span v-else-if="col.key === 'net_trust_dr'">0</span>
              <span v-else-if="col.key === 'net_trust_cr'">0</span>
              <span v-else-if="col.key === 'prop_account'">0</span>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
  </v-container>
</template>

<script lang="ts">
import Items from "~/data/json/gstrr003.json";

export default {
  data() {
    return {
      headers: [] as {
        title: string;
        align: "start" | "center" | "end";
        key: string;
        removable: boolean;
      }[],
      dataItems: [] as { [key: string]: any }[],

      summaryTotal: {
        thb: {
          avail_dr: 0,
          avail_cr: 0,
          pending_buy: 0,
          pending_sell: 0,
          ledger_dr: 0,
          total_settle: 0,
          short_sell: 0,
          trust_bl_dr: 0,
          trust_avail_cr: 0,
          unckeck_bl: 0,
          net_trust_dr: 0,
          net_trust_cr: 0,
        },
        usd: {
          avail_dr: 0,
          avail_cr: 0,
          pending_buy: 0,
          pending_sell: 0,
          ledger_dr: 0,
          total_settle: 0,
          short_sell: 0,
          trust_bl_dr: 0,
          trust_avail_cr: 0,
          unckeck_bl: 0,
          net_trust_dr: 0,
          net_trust_cr: 0,
        },
      },
    };
  },
  mounted() {
    this.headers = this.fetchHeaders();
    this.dataItems = Items.dataList;
  },
  methods: {
    fetchHeaders() {
      return [
        {
          title: "Account Number",
          align: "start" as "start",
          key: "account_no",
          removable: false,
        },
        {
          title: "Account Name",
          align: "start" as "start",
          key: "name_en",
          removable: false,
        },
        {
          title: "Account Type",
          align: "start" as "start",
          key: "account_type",
          removable: true,
        },
        {
          title: "Account Class",
          align: "center" as "center",
          key: "account_class",
          removable: true,
        },
        {
          title: "Currency",
          align: "center" as "center",
          key: "currency",
          removable: false,
        },
        {
          title: "Available Balance Dr",
          align: "end" as "end",
          key: "avail_dr",
          removable: true,
        },
        {
          title: "Available Balance Cr",
          align: "end" as "end",
          key: "avail_cr",
          removable: true,
        },
        {
          title: "Uncome Balance Dr",
          align: "end" as "end",
          key: "pending_buy",
          removable: true,
        },
        {
          title: "Uncome Balance Cr",
          align: "end" as "end",
          key: "pending_sell",
          removable: true,
        },
        {
          title: "Ledger Balance Dr",
          align: "end" as "end",
          key: "ledger_dr",
          removable: true,
        },
        {
          title: "Ledger Balance Cr",
          align: "end" as "end",
          key: "total_settle",
          removable: true,
        },
        {
          title: "Short Selling Proceeds Being Withheld",
          align: "end" as "end",
          key: "short_sell",
          removable: true,
        },
        {
          title: "Trust Balance Dr",
          align: "end" as "end",
          key: "trust_bl_dr",
          removable: true,
        },
        {
          title: "Trust Balance Cr",
          align: "end" as "end",
          key: "trust_avail_cr",
          removable: true,
        },
        {
          title: "Uncheck Balance",
          align: "end" as "end",
          key: "unckeck_bl",
          removable: true,
        },
        {
          title: "Net Trust Balance Dr",
          align: "end" as "end",
          key: "net_trust_dr",
          removable: true,
        },
        {
          title: "Net Trust Balance Cr",
          align: "end" as "end",
          key: "net_trust_cr",
          removable: true,
        },
        {
          title: "Proprietary Account",
          align: "center" as "center",
          key: "prop_account",
          removable: true,
        },
      ];
    },

    onClickReset() {
      this.headers = this.fetchHeaders();
    },

    remove(columnKey: string) {
      this.headers = this.headers.filter((header) => header.key !== columnKey);
    },
  },
};
</script>

<style lang="scss">
.selected-row {
  background-color: red;
}
</style>
